import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Star, ChevronLeft, ChevronRight, Check, AlertCircle, Sparkles } from 'lucide-react';
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
      // 1. If already known configured, redirect directly to Google OAuth
      if (providers.googleConfigured) {
        loginWithGoogle();
        return;
      }

      // 2. Double-check provider status from backend in case initial fetch was delayed
      const res = await fetch('/api/auth/providers').catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.googleConfigured) {
          loginWithGoogle();
          return;
        }
      }

      // 3. Fallback to local account chooser dialog if unconfigured
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
        // Dismiss when clicking directly on the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#100804]/80 backdrop-blur-md animate-backdrop-fade"
    >
      {/* Modal Surface: Compact, Clean Dual-Tone (Left Parchment + Right Cozy Artwork) */}
      <div className="relative bg-[#fbf4e8] text-[#2a170f] max-w-[850px] w-full rounded-[24px] sm:rounded-[30px] shadow-[0_25px_80px_rgba(10,5,3,0.8)] border border-[#3a2318]/20 flex flex-col lg:flex-row items-stretch overflow-hidden animate-modal-pop">
        
        {/* ================= Left Column: Compact Warm Parchment Auth Form ================= */}
        <div className="relative flex-1 px-5 py-5 sm:px-7 sm:py-6 flex flex-col justify-center bg-[#fbf4e8] overflow-hidden">
          
          {/* Delicate Dappled Leaf Shadow Overlay in Top Right */}
          <svg
            className="absolute -top-2 -right-2 w-48 h-36 pointer-events-none opacity-[0.09] text-[#4a2612] select-none"
            viewBox="0 0 200 150"
            fill="currentColor"
            style={{ filter: 'blur(0.8px)' }}
          >
            {/* Organic botanical branch and leaves */}
            <path d="M190 0 C160 25, 130 45, 90 75 C75 87, 50 110, 30 145 C28 142, 45 110, 68 90 C95 65, 130 40, 190 10 Z" />
            <ellipse cx="145" cy="30" rx="20" ry="8" transform="rotate(-30 145 30)" />
            <ellipse cx="120" cy="48" rx="18" ry="7" transform="rotate(-40 120 48)" />
            <ellipse cx="165" cy="20" rx="16" ry="6" transform="rotate(-20 165 20)" />
            <ellipse cx="95" cy="70" rx="17" ry="7" transform="rotate(-48 95 70)" />
            <ellipse cx="75" cy="92" rx="15" ry="6" transform="rotate(-55 75 92)" />
            <ellipse cx="50" cy="118" rx="14" ry="5.5" transform="rotate(-60 50 118)" />
            <ellipse cx="130" cy="62" rx="14" ry="6" transform="rotate(25 130 62)" />
            <ellipse cx="108" cy="82" rx="13" ry="5.5" transform="rotate(30 108 82)" />
          </svg>

          {/* Brand Logo Header */}
          <div className="relative z-10 flex items-center gap-1.5 mb-2 sm:mb-2.5">
            <span className="text-[#b4532a] font-serif text-base leading-none select-none">✦</span>
            <span className="font-serif text-xl tracking-tight text-[#2a170f] font-normal">Rehearse</span>
          </div>

          {/* Animated Mode Container for smooth sign up <-> log in switch */}
          <div key={mode} className="relative z-10 animate-fade-in-up space-y-2.5 sm:space-y-3">
            {/* Headline & Description */}
            <div>
              <h2 className="font-serif text-[24px] sm:text-[27px] font-normal tracking-tight text-[#2a170f] leading-tight">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-0.5 text-xs sm:text-[13px] text-[#3a2318]/75 leading-relaxed font-sans">
                {mode === 'signup'
                  ? 'Start practicing for real interviews with an AI interviewer, tailored to your goals.'
                  : 'Continue your mock interview preparation right where you left off.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#9c3a1a]/15 border border-[#9c3a1a]/30 text-[#9c3a1a] text-[11px] sm:text-xs flex items-start gap-1.5 animate-fade-in-down">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9c3a1a]" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Social Authentication Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              {/* Google */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSocialGoogle}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#f2e7d3] hover:bg-[#ebdcc4] border border-[#3a2318]/15 hover:border-[#3a2318]/30 shadow-2xs text-[12px] font-medium text-[#2a170f] font-sans transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSocialGitHub}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#f2e7d3] hover:bg-[#ebdcc4] border border-[#3a2318]/15 hover:border-[#3a2318]/30 shadow-2xs text-[12px] font-medium text-[#2a170f] font-sans transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 hover:scale-[1.01] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 shrink-0 fill-current text-[#2a170f]" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Editorial Divider */}
            <div className="relative my-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3a2318]/15" />
              </div>
              <div className="relative flex justify-center text-[11px] font-sans text-[#3a2318]/60">
                <span className="bg-[#fbf4e8] px-2.5">
                  {mode === 'signup' ? 'Or sign up with email' : 'Or sign in with email'}
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-2.5">
              
              {/* Full Name (Sign Up only) */}
              {mode === 'signup' && (
                <div className="animate-fade-in-up">
                  <label className="block text-[11.5px] font-medium text-[#2a170f] mb-0.5 font-sans">
                    Full name
                  </label>
                  <div className="relative rounded-xl border border-[#3a2318]/20 bg-[#fdf9f0] focus-within:bg-[#ffffff] focus-within:border-[#b4532a] focus-within:ring-2 focus-within:ring-[#b4532a]/15 shadow-2xs transition-all">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3a2318]/50 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11.5px] font-medium text-[#2a170f] font-sans">
                    Email
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="text-[10.5px] font-mono text-[#b4532a] hover:text-[#7d3418] hover:underline flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                    >
                      <Sparkles className="w-3 h-3 text-[#b4532a]" />
                      <span>Use demo account</span>
                    </button>
                  )}
                </div>

                <div className="relative rounded-xl border border-[#3a2318]/20 bg-[#fdf9f0] focus-within:bg-[#ffffff] focus-within:border-[#b4532a] focus-within:ring-2 focus-within:ring-[#b4532a]/15 shadow-2xs transition-all">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3a2318]/50 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="block text-[11.5px] font-medium text-[#2a170f] font-sans">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="text-[10.5px] text-[#b4532a] hover:text-[#7d3418] transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative rounded-xl border border-[#3a2318]/20 bg-[#fdf9f0] focus-within:bg-[#ffffff] focus-within:border-[#b4532a] focus-within:ring-2 focus-within:ring-[#b4532a]/15 shadow-2xs transition-all">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3a2318]/50 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                    className="w-full pl-9 pr-9 py-1.5 sm:py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a2318]/50 hover:text-[#2a170f] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements (Sign Up only) */}
              {mode === 'signup' && (
                <div className="pt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] font-sans">
                  <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/60'}`}>
                    <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-700' : 'text-[#3a2318]/35'}`} />
                    <span>At least 8 characters</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/60'}`}>
                    <Check className={`w-3 h-3 ${hasNumber ? 'text-emerald-700' : 'text-[#3a2318]/35'}`} />
                    <span>One number</span>
                  </span>
                  <span className={`inline-flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/60'}`}>
                    <Check className={`w-3 h-3 ${hasSpecial ? 'text-emerald-700' : 'text-[#3a2318]/35'}`} />
                    <span>One special character</span>
                  </span>
                </div>
              )}

              {/* Submit Button in Rich Warm Terracotta / Chocolate */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#522412] hover:bg-[#431b0c] active:scale-[0.99] text-[#fdfaf3] font-medium text-[13.5px] font-sans shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>
                  {isLoading
                    ? (mode === 'signup' ? 'Creating account...' : 'Signing in...')
                    : (mode === 'signup' ? 'Create account' : 'Sign in')}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="pt-1 text-center text-[11.5px] text-[#3a2318]/75 font-sans">
              {mode === 'signup' ? (
                <>
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-semibold text-[#522412] hover:text-[#b4532a] hover:underline cursor-pointer transition-transform hover:scale-105 inline-block"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-semibold text-[#522412] hover:text-[#b4532a] hover:underline cursor-pointer transition-transform hover:scale-105 inline-block"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= Right Column: Flush Artwork with Compact Proportions ================= */}
        <div className="hidden lg:flex lg:w-[390px] xl:w-[410px] self-stretch shrink-0 relative flex-col justify-end overflow-hidden bg-[#160d08]">
          
          {/* Background Illustration extending edge-to-edge */}
          <img
            src="/images/rehearse/auth-study-artwork.jpg"
            alt="Candidate studying at desk overlooking mountains"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Solid gradient to eliminate all ghost text from underlying capture */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140b07] from-35% via-[#140b07]/90 via-55% to-transparent pointer-events-none" />

          {/* Testimonial Content Box with Smooth Fade Transition */}
          <div className="relative z-10 p-5 sm:p-6 text-[#f6ebd4]">
            
            <div key={testimonialIdx} className="animate-fade-in-up">
              {/* 5 Gold Stars */}
              <div className="flex items-center gap-1 text-[#dfa84c] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#dfa84c] stroke-none" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-serif italic text-[14.5px] sm:text-[15.5px] text-[#f6ebd4] leading-relaxed mb-3 min-h-[46px]">
                “{currentTestimonial.quote}”
              </p>

              {/* Author Attribution */}
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                <div>
                  <div className="font-sans font-medium text-[12.5px] text-[#f6ebd4]">
                    — {currentTestimonial.name}
                  </div>
                  <div className="text-[10.5px] text-[#dfa84c] font-mono">
                    {currentTestimonial.role}
                  </div>
                </div>

                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevTestimonial}
                    className="w-6 h-6 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTestimonial}
                    className="w-6 h-6 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

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
