import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, Check, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthDialog } from './GoogleAuthDialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signup' | 'login';
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Rehearse helped me build real confidence for my system design interview. The AI feedback felt genuinely insightful.",
    name: "Aman Verma",
    role: "SDE @ Google",
    rating: 5,
  },
  {
    quote: "The unscripted follow-up questions felt identical to my final-round partner interview. Worth every minute.",
    name: "Priya Sundaram",
    role: "Senior PM @ Stripe",
    rating: 5,
  },
  {
    quote: "Mastering the STAR framework aloud instead of reading notes transformed how I presented my engineering decisions.",
    name: "Marcus Vance",
    role: "Frontend Lead @ Linear",
    rating: 5,
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup'
}) => {
  const { signUp, login, loginWithGoogle, loginWithGitHub, isLoading, error, clearError, providers } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Clear errors when toggling modes or closing
  useEffect(() => {
    clearError();
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  const handleNextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (mode === 'signup') {
      const ok = await signUp(fullName, email, password);
      if (ok) {
        onClose();
      }
    } else {
      const ok = await login(email, password);
      if (ok) {
        onClose();
      }
    }
  };

  const handleSocialGoogle = async () => {
    try {
      if (providers.googleConfigured) {
        loginWithGoogle();
        return;
      }

      const res = await fetch('/api/auth/providers').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.googleConfigured) {
          loginWithGoogle();
          return;
        }
      }

      setIsGoogleDialogOpen(true);
    } catch {
      setIsGoogleDialogOpen(true);
    }
  };

  const handleSocialGitHub = () => {
    loginWithGitHub();
  };

  const fillDemoCredentials = () => {
    setEmail('demo@rehearse.ai');
    setPassword('password123');
    clearError();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-backdrop-fade"
    >
      <div className="w-full max-w-sm md:max-w-4xl flex flex-col gap-4 animate-modal-pop">
        
        {/* Main Card Container (shadcn login-04 block) */}
        <div className="overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl text-zinc-100">
          <div className="grid md:grid-cols-2">
            
            {/* Left Column: Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col justify-center gap-4">
              
              {/* Header Title & Subtitle */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {mode === 'signup' ? 'Create an account' : 'Welcome back'}
                </h1>
                <p className="text-sm text-zinc-400">
                  {mode === 'signup'
                    ? 'Enter your details below to create your account'
                    : 'Login to your Rehearse account'}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-2.5 rounded-md bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="text-xs font-medium text-zinc-300">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 rounded-md bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                  />
                </div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-medium text-zinc-300">
                    Password
                  </label>
                  {mode === 'login' ? (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400">
                      <button
                        type="button"
                        onClick={fillDemoCredentials}
                        className="hover:text-white underline-offset-2 hover:underline cursor-pointer"
                      >
                        Use demo
                      </button>
                      <span>•</span>
                      <a href="#" className="hover:text-white underline-offset-2 hover:underline">
                        Forgot your password?
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-9 py-2 rounded-md bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements (Sign Up only) */}
              {mode === 'signup' && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                  <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>8+ characters</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>One number</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasSpecial ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    <Check className="w-3.5 h-3.5" />
                    <span>Special character</span>
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-2 px-4 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading
                  ? 'Please wait...'
                  : mode === 'signup'
                  ? 'Sign up'
                  : 'Login'}
              </button>

              {/* Field Separator */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-zinc-900 px-2 text-zinc-400 font-sans">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* 3 Social Buttons in a Grid (Apple, Google, Meta/GitHub) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Apple */}
                <button
                  type="button"
                  className="flex items-center justify-center py-2 px-3 rounded-md border border-zinc-700/80 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
                  title="Login with Apple"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleSocialGoogle}
                  className="flex items-center justify-center py-2 px-3 rounded-md border border-zinc-700/80 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
                  title="Login with Google"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </button>

                {/* Meta / GitHub */}
                <button
                  type="button"
                  onClick={handleSocialGitHub}
                  className="flex items-center justify-center py-2 px-3 rounded-md border border-zinc-700/80 bg-zinc-800/40 hover:bg-zinc-800 text-zinc-200 transition-colors cursor-pointer"
                  title="Login with Meta or GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Meta</span>
                </button>
              </div>

              {/* Bottom Switch Link */}
              <div className="text-center text-xs text-zinc-400">
                {mode === 'signup' ? (
                  <>
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="underline underline-offset-2 hover:text-white text-zinc-200 font-medium cursor-pointer"
                    >
                      Login
                    </button>
                  </>
                ) : (
                  <>
                    <span>Don&apos;t have an account? </span>
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="underline underline-offset-2 hover:text-white text-zinc-200 font-medium cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>

            </form>

            {/* Right Column: Image with Subtle Testimonial Overlay */}
            <div className="relative hidden md:block bg-zinc-950 overflow-hidden">
              <img
                src="/images/rehearse/auth-study-artwork.jpg"
                alt="Rehearse interview preparation environment"
                className="absolute inset-0 h-full w-full object-cover brightness-[0.5] select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent pointer-events-none" />

              {/* Bottom Testimonial */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-zinc-200">
                <div key={testimonialIdx} className="animate-fade-in-up">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                  <p className="font-serif italic text-sm text-zinc-200 leading-relaxed mb-3">
                    “{currentTestimonial.quote}”
                  </p>
                  <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2.5">
                    <div>
                      <div className="font-medium text-xs text-white">
                        — {currentTestimonial.name}
                      </div>
                      <div className="text-[11px] text-amber-400/90 font-mono">
                        {currentTestimonial.role}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevTestimonial}
                        className="w-6 h-6 rounded-full border border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextTestimonial}
                        className="w-6 h-6 rounded-full border border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Outer Disclaimer under the Card */}
        <p className="px-6 text-center text-xs text-zinc-500 font-sans">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-zinc-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:text-zinc-300">
            Privacy Policy
          </a>
          .
        </p>

      </div>

      {/* Google OAuth Dialog */}
      <GoogleAuthDialog
        isOpen={isGoogleDialogOpen}
        onClose={() => setIsGoogleDialogOpen(false)}
        onSuccess={onClose}
      />
    </div>
  );
};
