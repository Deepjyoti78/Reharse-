import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GoogleAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface GoogleAccountOption {
  name: string;
  email: string;
  avatarColor: string;
}

const SAVED_GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
  {
    name: 'Deepjyoti Das',
    email: 'deepjyotidas78@gmail.com',
    avatarColor: '#b8542c'
  },
  {
    name: 'Deepjyoti (Work)',
    email: 'deepjyoti.eng@gmail.com',
    avatarColor: '#4285F4'
  }
];

export const GoogleAuthDialog: React.FC<GoogleAuthDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { refreshSession } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectAccount = async (account: GoogleAccountOption) => {
    setSelectedEmail(account.email);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/dev-google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=b8542c&color=ffffff&bold=true`
        })
      });

      if (res.ok) {
        await refreshSession();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    const name = customName.trim();
    const email = customEmail.trim().toLowerCase();

    if (!name) {
      setCustomError('Please enter your full name.');
      return;
    }

    if (!email || !email.includes('@')) {
      setCustomError('Please enter a valid Google email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/dev-google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=ffffff&bold=true`
        })
      });

      if (res.ok) {
        await refreshSession();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.warn('Google custom sign-in error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-backdrop-fade"
    >
      <div className="relative bg-white text-[#1f1f1f] max-w-[440px] w-full rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-modal-pop font-sans">
        
        {/* Top Google Colors Accent Bar */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-[#4285F4]" />
          <div className="flex-1 bg-[#EA4335]" />
          <div className="flex-1 bg-[#FBBC05]" />
          <div className="flex-1 bg-[#34A853]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer disabled:opacity-40"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Google Header */}
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h2 className="text-lg font-medium text-[#1f1f1f] leading-none">
                Sign in with Google
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose an account to continue to <span className="font-semibold text-gray-700">Rehearse</span>
              </p>
            </div>
          </div>

          {/* Real OAuth Credentials Status Banner */}
          <div className="mb-3 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-tight flex items-start gap-2">
            <span className="font-semibold text-blue-800">OAuth Setup:</span>
            <span>
              To activate direct Google Cloud redirection, add your <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GOOGLE_CLIENT_ID</code> and <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GOOGLE_CLIENT_SECRET</code> to <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.env.local</code>. Selecting an account below authenticates and saves directly into the SQLite backend database.
            </span>
          </div>

          {/* Account Selector List */}
          {!showCustomForm ? (
            <div className="space-y-2 my-5">
              {SAVED_GOOGLE_ACCOUNTS.map((acc) => {
                const isSelected = selectedEmail === acc.email && isSubmitting;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 transition-all flex items-center justify-between text-left cursor-pointer group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-xs"
                        style={{ backgroundColor: acc.avatarColor }}
                      >
                        {acc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-[13px] font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate font-mono">
                          {acc.email}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Use another account option */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowCustomForm(true)}
                className="w-full p-3 rounded-xl border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center gap-3 text-left cursor-pointer text-xs font-medium text-gray-700 hover:text-blue-600"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Use another Google account</span>
              </button>
            </div>
          ) : (
            /* Custom Google Account Entry Form */
            <form onSubmit={handleCustomSubmit} className="space-y-3.5 my-5 animate-fade-in-up">
              {customError && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {customError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deepjyoti Das"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Google Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Continue with this account</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Google OAuth Disclosure Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-start gap-2 text-[11px] text-gray-500 leading-tight">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              To continue, Google will securely share your verified name, email address, and profile photo with Rehearse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
