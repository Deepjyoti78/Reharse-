import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: 'email' | 'google' | 'github';
  targetRole?: string;
  readinessScore?: number;
  completedSessions?: number;
}

interface StoredAccount extends User {
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (profile?: { name: string; email: string; avatarUrl?: string }) => Promise<boolean>;
  loginWithGitHub: () => Promise<boolean>;
  logout: () => void;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'demo-1',
    name: 'Aman Verma',
    email: 'demo@rehearse.ai',
    password: 'password123',
    provider: 'email',
    targetRole: 'Software engineering',
    readinessScore: 94,
    completedSessions: 8,
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing session on initial mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('rehearse_current_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Ensure demo accounts are in localStorage if not already present
      const storedAccounts = localStorage.getItem('rehearse_accounts');
      if (!storedAccounts) {
        localStorage.setItem('rehearse_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearError = () => setError(null);

  // Get current list of stored accounts
  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const raw = localStorage.getItem('rehearse_accounts');
      return raw ? JSON.parse(raw) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  };

  const saveStoredAccounts = (accounts: StoredAccount[]) => {
    try {
      localStorage.setItem('rehearse_accounts', JSON.stringify(accounts));
    } catch {
      // Ignore storage errors
    }
  };

  const setSessionUser = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('rehearse_current_user', JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate authentic network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

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

    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (existing) {
      setError('An account with this email already exists. Please log in instead.');
      setIsLoading(false);
      return false;
    }

    const newAccount: StoredAccount = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      provider: 'email',
      targetRole: 'Software engineering',
      readinessScore: 78,
      completedSessions: 1,
    };

    saveStoredAccounts([...accounts, newAccount]);
    setSessionUser(newAccount);
    setIsLoading(false);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9']
    });

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 550));

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();
    const match = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!match || match.password !== password) {
      setError('Invalid email or password. Try demo@rehearse.ai / password123');
      setIsLoading(false);
      return false;
    }

    setSessionUser(match);
    setIsLoading(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9']
    });

    return true;
  };

  const loginWithGoogle = async (profile?: { name: string; email: string; avatarUrl?: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const accountName = profile?.name?.trim() || 'Deepjyoti Das';
    const accountEmail = profile?.email?.trim().toLowerCase() || 'deepjyotidas78@gmail.com';
    const avatarUrl = profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName)}&background=b8542c&color=fdfaf3&bold=true`;

    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === accountEmail);

    const googleUser: StoredAccount = existing
      ? { ...existing, provider: 'google', avatarUrl: avatarUrl || existing.avatarUrl }
      : {
          id: `google-${Date.now()}`,
          name: accountName,
          email: accountEmail,
          avatarUrl,
          provider: 'google',
          targetRole: 'Full Stack Engineer',
          readinessScore: 92,
          completedSessions: 4,
        };

    if (!existing) {
      saveStoredAccounts([...accounts, googleUser]);
    }

    setSessionUser(googleUser);
    setIsLoading(false);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
    });

    return true;
  };

  const loginWithGitHub = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const gitHubUser: User = {
      id: `github-${Date.now()}`,
      name: 'Alex Rivera',
      email: 'alex@github.com',
      provider: 'github',
      targetRole: 'Distributed Systems Lead',
      readinessScore: 95,
      completedSessions: 7,
    };

    setSessionUser(gitHubUser);
    setIsLoading(false);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#24292e', '#dfa84c', '#b8542c', '#f3e7c9']
    });

    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('rehearse_current_user');
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        clearError,
        signUp,
        login,
        loginWithGoogle,
        loginWithGitHub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

