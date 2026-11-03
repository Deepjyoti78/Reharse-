import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  provider?: 'email' | 'google' | 'github';
  targetRole?: string;
  readinessScore?: number;
  completedSessions?: number;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface AuthProvidersStatus {
  googleConfigured: boolean;
  githubConfigured: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  providers: AuthProvidersStatus;
  clearError: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<AuthProvidersStatus>({
    googleConfigured: false,
    githubConfigured: false,
  });

  const clearError = () => setError(null);

  // Check backend session & provider configuration on initial mount
  const refreshSession = async () => {
    try {
      // 1. Fetch configured OAuth providers
      fetch('/api/auth/providers')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setProviders({
              googleConfigured: Boolean(data.googleConfigured),
              githubConfigured: Boolean(data.githubConfigured),
            });
          }
        })
        .catch(() => {});

      // 2. Fetch authenticated user from backend session cookie
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('rehearse_current_user', JSON.stringify(data.user));
          setIsLoading(false);
          return;
        }
      }

      // 3. Fallback to cached user if offline or unauthenticated
      const cached = localStorage.getItem('rehearse_current_user');
      if (cached) {
        setUser(JSON.parse(cached));
      } else {
        setUser(null);
      }
    } catch {
      const cached = localStorage.getItem('rehearse_current_user');
      if (cached) {
        setUser(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Check for OAuth callback redirect parameters in URL
    const searchParams = new URLSearchParams(window.location.search);
    const authStatus = searchParams.get('auth');
    const authError = searchParams.get('auth_error');

    if (authStatus === 'success') {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#b8542c'],
      });
      // Clean query params from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authError) {
      setError(decodeURIComponent(authError));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    refreshSession();
  }, []);

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Please provide your full name.');
      setIsLoading(false);
      return false;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      setIsLoading(false);
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setIsLoading(false);
      return false;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setIsLoading(false);
        return false;
      }

      setUser(data.user);
      localStorage.setItem('rehearse_current_user', JSON.stringify(data.user));
      setIsLoading(false);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9'],
      });

      return true;
    } catch {
      setError('Unable to reach server. Please check your network connection.');
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return false;
      }

      setUser(data.user);
      localStorage.setItem('rehearse_current_user', JSON.stringify(data.user));
      setIsLoading(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9'],
      });

      return true;
    } catch {
      setError('Unable to reach server. Please check your network connection.');
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Initiates real Google OAuth 2.0 redirection flow
   */
  const loginWithGoogle = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    // Save current route so user returns where they left off
    const currentPath = window.location.pathname;
    window.location.href = `/api/auth/google?destination=${encodeURIComponent(currentPath)}`;
  };

  /**
   * Initiates real GitHub OAuth authorization redirection flow
   */
  const loginWithGitHub = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    const currentPath = window.location.pathname;
    window.location.href = `/api/auth/github?destination=${encodeURIComponent(currentPath)}`;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('rehearse_current_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        error,
        providers,
        clearError,
        signUp,
        login,
        loginWithGoogle,
        loginWithGitHub,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
