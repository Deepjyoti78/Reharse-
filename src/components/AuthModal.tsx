import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Star, ChevronLeft, ChevronRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const { signUp, login, loginWithGoogle, loginWithGitHub, isLoading, error, clearError } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

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
    const ok = await loginWithGoogle();
    if (ok) onClose();
  };

  const handleSocialGitHub = async () => {
    const ok = await loginWithGitHub();
    if (ok) onClose();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#180d08]/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Modal Surface: Flush right picture with zero gap to boundary */}
      <div className="relative bg-[#faf4e8] text-[#2a170f] max-w-[920px] w-full rounded-[28px] sm:rounded-[34px] shadow-[0_35px_100px_rgba(20,10,6,0.5)] border border-[#3a2318]/20 flex flex-col lg:flex-row items-stretch overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ================= Left Column: Auth Form ================= */}
        <div className="flex-1 p-6 sm:p-7 lg:p-8 flex flex-col justify-center space-y-3.5">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 text-[#b8542c] font-serif text-lg leading-none">✦</span>
            <span className="font-serif text-2xl tracking-tight text-[#2a170f]">Rehearse</span>
          </div>

          {/* Headline & Description */}
          <div>
            <h2 className="font-serif text-[28px] sm:text-[32px] font-normal tracking-tight text-[#2a170f] leading-[1.08]">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-[13px] sm:text-[13.5px] text-[#3a2318]/70 leading-relaxed font-sans">
              {mode === 'signup'
                ? 'Start practicing for real interviews with an AI interviewer, tailored to your goals.'
                : 'Continue your mock interview preparation right where you left off.'}
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-[#9c3a1a]/10 border border-[#9c3a1a]/25 text-[#9c3a1a] text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Social Authentication Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            {/* Google */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSocialGoogle}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-[#fbf7f0] border border-[#3a2318]/15 shadow-xs text-xs font-medium text-[#2a170f] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-[#fbf7f0] border border-[#3a2318]/15 shadow-xs text-xs font-medium text-[#2a170f] transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-[#2a170f]" viewBox="0 0 24 24">
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
              <span className="bg-[#faf4e8] px-3">
                {mode === 'signup' ? 'Or sign up with email' : 'Or sign in with email'}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-[11.5px] font-semibold text-[#2a170f] mb-1">
                  Full name
                </label>
                <div className="relative rounded-xl border border-[#3a2318]/20 bg-white/80 focus-within:bg-white focus-within:border-[#b8542c] focus-within:ring-2 focus-within:ring-[#b8542c]/15 transition-all">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a2318]/45 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11.5px] font-semibold text-[#2a170f]">
                  Email
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[11px] font-mono text-[#b8542c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#dfa84c]" />
                    <span>Use demo account</span>
                  </button>
                )}
              </div>

              <div className="relative rounded-xl border border-[#3a2318]/20 bg-white/80 focus-within:bg-white focus-within:border-[#b8542c] focus-within:ring-2 focus-within:ring-[#b8542c]/15 transition-all">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a2318]/45 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11.5px] font-semibold text-[#2a170f]">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[11px] text-[#3a2318]/60 hover:text-[#b8542c] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative rounded-xl border border-[#3a2318]/20 bg-white/80 focus-within:bg-white focus-within:border-[#b8542c] focus-within:ring-2 focus-within:ring-[#b8542c]/15 transition-all">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3a2318]/45 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2 bg-transparent text-[13px] text-[#2a170f] focus:outline-none placeholder-[#3a2318]/40 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3a2318]/50 hover:text-[#2a170f] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements (Sign Up only) */}
            {mode === 'signup' && (
              <div className="pt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-sans">
                <span className={`inline-flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/55'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-600' : 'text-[#3a2318]/35'}`} />
                  <span>At least 8 characters</span>
                </span>
                <span className={`inline-flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/55'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasNumber ? 'text-emerald-600' : 'text-[#3a2318]/35'}`} />
                  <span>One number</span>
                </span>
                <span className={`inline-flex items-center gap-1 ${hasSpecial ? 'text-emerald-700 font-medium' : 'text-[#3a2318]/55'}`}>
                  <Check className={`w-3.5 h-3.5 ${hasSpecial ? 'text-emerald-600' : 'text-[#3a2318]/35'}`} />
                  <span>One special character</span>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-5 rounded-xl bg-[#b8542c] hover:bg-[#a04520] active:scale-[0.99] text-[#fdfaf3] font-medium text-[13.5px] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>
                {isLoading
                  ? (mode === 'signup' ? 'Creating account...' : 'Signing in...')
                  : (mode === 'signup' ? 'Create account' : 'Sign in')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="pt-1 text-center text-xs text-[#3a2318]/75 font-sans">
            {mode === 'signup' ? (
              <>
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-[#b8542c] hover:underline cursor-pointer"
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
                  className="font-semibold text-[#b8542c] hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= Right Column: Flush Artwork with Zero Gap to Boundary ================= */}
        <div className="hidden lg:flex lg:w-[460px] xl:w-[490px] self-stretch shrink-0 relative flex-col justify-end overflow-hidden bg-[#160d08]">
          
          {/* Background Illustration extending edge-to-edge */}
          <img
            src="/images/rehearse/auth-study-artwork.jpg"
            alt="Candidate studying at desk overlooking mountains"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Solid gradient to eliminate all ghost text from underlying capture */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#140b07] from-35% via-[#140b07]/90 via-55% to-transparent pointer-events-none" />

          {/* Testimonial Content Box */}
          <div className="relative z-10 p-6 sm:p-7 text-[#f6ebd4]">
            
            {/* 5 Gold Stars */}
            <div className="flex items-center gap-1 text-[#dfa84c] mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#dfa84c] stroke-none" />
              ))}
            </div>

            {/* Quote */}
            <p className="font-serif italic text-base sm:text-[17.5px] text-[#f6ebd4] leading-relaxed mb-3.5">
              “{currentTestimonial.quote}”
            </p>

            {/* Author Attribution & Pagination Controls */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <div>
                <div className="font-sans font-medium text-[13px] text-[#f6ebd4]">
                  — {currentTestimonial.name}
                </div>
                <div className="text-[11px] text-[#dfa84c] font-mono">
                  {currentTestimonial.role}
                </div>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevTestimonial}
                  className="w-7 h-7 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextTestimonial}
                  className="w-7 h-7 rounded-full border border-white/20 hover:border-white/50 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
  );
};
