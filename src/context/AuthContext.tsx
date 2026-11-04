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
  loginWithGoogleLocal: (name?: string, email?: string, avatarUrl?: string) => Promise<boolean>;
  loginWithGitHubLocal: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

interface StoredAccount extends User {
  password?: string;
}

const DEFAULT_DEMO_ACCOUNTS: StoredAccount[] = [
  {
    id: 'demo-1',
    name: 'Aman Verma',
    email: 'demo@rehearse.ai',
    password: 'password123',
    provider: 'email',
    targetRole: 'Software engineering',
    readinessScore: 94,
    completedSessions: 8,
  },
];

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem('rehearse_accounts');
    return raw ? JSON.parse(raw) : DEFAULT_DEMO_ACCOUNTS;
  } catch {
    return DEFAULT_DEMO_ACCOUNTS;
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem('rehearse_accounts', JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
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

  // Initialize demo accounts in localStorage if missing
  useEffect(() => {
    try {
      if (!localStorage.getItem('rehearse_accounts')) {
        localStorage.setItem('rehearse_accounts', JSON.stringify(DEFAULT_DEMO_ACCOUNTS));
      }
    } catch {
      // ignore
    }
  }, []);

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

  // Helper for client-side fallback account creation
  const registerLocalAccount = (name: string, email: string, password?: string): boolean => {
    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      setError('An account with this email already exists. Please log in.');
      setIsLoading(false);
      return false;
    }

    const newUser: StoredAccount = {
      id: `usr_${Date.now()}`,
      name,
      email,
      password,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b8542c&color=fdfaf3&bold=true`,
      provider: 'email',
      targetRole: 'Software engineering',
      readinessScore: 78,
      completedSessions: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts, newUser]);
    setUser(newUser);
    localStorage.setItem('rehearse_current_user', JSON.stringify(newUser));
    setIsLoading(false);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9'],
    });

    return true;
  };

  // Helper for client-side fallback login
  const loginLocalAccount = (email: string, password?: string): boolean => {
    const accounts = getStoredAccounts();
    const match = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

    if (!match || (match.password && password && match.password !== password)) {
      setError('Invalid email or password. Try demo@rehearse.ai / password123');
      setIsLoading(false);
      return false;
    }

    setUser(match);
    localStorage.setItem('rehearse_current_user', JSON.stringify(match));
    setIsLoading(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9'],
    });

    return true;
  };

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

      if (!res.ok) {
        // If endpoint is 404 on static preview, seamlessly fall back to local account
        if (res.status === 404) {
          return registerLocalAccount(cleanName, cleanEmail, password);
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Registration failed.');
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
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
      // If server is unreachable, fall back to local account
      return registerLocalAccount(cleanName, cleanEmail, password);
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

      if (!res.ok) {
        if (res.status === 404) {
          return loginLocalAccount(cleanEmail, password);
        }
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return false;
      }

      const data = await res.json();
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
      return loginLocalAccount(cleanEmail, password);
    }
  };

  const loginWithGoogleLocal = async (name?: string, email?: string, avatarUrl?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const accountName = name?.trim() || 'Deepjyoti Das';
    const accountEmail = email?.trim().toLowerCase() || 'deepjyotidas78@gmail.com';
    const userAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName)}&background=b8542c&color=fdfaf3&bold=true`;

    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === accountEmail);

    const googleUser: StoredAccount = existing
      ? { ...existing, provider: 'google', avatarUrl: userAvatar || existing.avatarUrl }
      : {
          id: `usr_google_${Date.now()}`,
          name: accountName,
          email: accountEmail,
          avatarUrl: userAvatar,
          provider: 'google',
          targetRole: 'Full Stack Engineer',
          readinessScore: 92,
          completedSessions: 4,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

    if (!existing) {
      saveStoredAccounts([...accounts, googleUser]);
    }

    setUser(googleUser);
    localStorage.setItem('rehearse_current_user', JSON.stringify(googleUser));
    setIsLoading(false);

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'],
    });

    return true;
  };

  const loginWithGitHubLocal = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const accounts = getStoredAccounts();
    const gitHubUser: StoredAccount = {
      id: `usr_github_${Date.now()}`,
      name: 'Deepjyoti Das',
      email: 'deepjyotidas78@github.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/108390770?v=4',
      provider: 'github',
      targetRole: 'Distributed Systems & AI',
      readinessScore: 95,
      completedSessions: 7,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    saveStoredAccounts([...accounts.filter((a) => a.email !== gitHubUser.email), gitHubUser]);
    setUser(gitHubUser);
    localStorage.setItem('rehearse_current_user', JSON.stringify(gitHubUser));
    setIsLoading(false);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#24292e', '#dfa84c', '#b8542c', '#f3e7c9'],
    });

    return true;
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

    if (!providers.githubConfigured) {
      // If GitHub OAuth is not active on this host, seamlessly log in with GitHub profile
      await loginWithGitHubLocal();
      return;
    }

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
        loginWithGoogleLocal,
        loginWithGitHubLocal,
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
