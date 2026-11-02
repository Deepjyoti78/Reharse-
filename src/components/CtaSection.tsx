import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CtaSectionProps {
  onOpenDemo: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onOpenDemo }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#b4532a', '#e0b25c', '#3a2318', '#f3e7c9']
    });
  };

  return (
    <section id="start" className="relative bg-[#e0b25c] text-[#2a1a12] py-24 sm:py-36 px-6 sm:px-12 text-center overflow-hidden border-t border-[#3a2318]/15">
      
      {/* Decorative Editorial Illustration on Left: Mountain Career Summit */}
      <div className="hidden lg:block absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 w-48 xl:w-60 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#3a2318]/25 -rotate-3 hover:rotate-0 transition-transform duration-500 bg-[#3a2318]">
        <img
          src="/images/rehearse/success/mountain-career-summit.webp"
          alt="Climbing the mountain career summit"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-2 left-2 right-2 bg-[#2a1a12]/80 backdrop-blur-xs text-[#f3e7c9] text-[10px] font-mono py-1 px-2 rounded text-center">
          Goal Attainment
        </div>
      </div>

      {/* Decorative Editorial Illustration on Right: Retro Rocket Launch */}
      <div className="hidden lg:block absolute right-8 xl:right-14 top-1/2 -translate-y-1/2 w-48 xl:w-60 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#3a2318]/25 rotate-3 hover:rotate-0 transition-transform duration-500 bg-[#3a2318]">
        <img
          src="/images/rehearse/success/rocket-interview-launch.webp"
          alt="Retro mid-century rocket launch to interview success"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-2 left-2 right-2 bg-[#2a1a12]/80 backdrop-blur-xs text-[#f3e7c9] text-[10px] font-mono py-1 px-2 rounded text-center">
          Career Trajectory
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#3a2318] bg-[#f3e7c9] px-3.5 py-1.5 rounded-full border border-[#3a2318]/15 mb-6 inline-block shadow-sm">
          Immediate Access
        </span>

        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#2a1a12] leading-[1.04] tracking-tight mb-6">
          Walk into your next interview <br />
          already warmed up
        </h2>

        <p className="text-[#3a2318]/90 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Join 12,000+ candidates who replaced pre-interview anxiety with articulate, calibrated composure.
        </p>

        {submitted ? (
          <div className="bg-[#f3e7c9] text-[#2a1a12] p-6 rounded-2xl max-w-md mx-auto border border-[#3a2318]/20 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-2xl font-normal text-[#2a1a12]">You're on the early access roster!</h4>
            <p className="text-sm text-[#3a2318]/80 mt-1 mb-4">
              We just sent your invite key to <strong className="text-[#2a1a12]">{email}</strong>.
            </p>
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#3a2318] text-[#f3e7c9] hover:bg-[#26150e] text-xs font-semibold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e0b25c]" />
              Launch Instant Mock Session
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-5 py-3.5 rounded-full bg-[#f3e7c9] border border-[#3a2318]/25 text-[#2a1a12] placeholder-[#3a2318]/60 focus:outline-none focus:ring-2 focus:ring-[#3a2318] text-sm shadow-sm"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#3a2318] text-[#f3e7c9] hover:bg-[#26150e] hover:shadow-lg transition-all text-sm font-semibold tracking-wide"
            >
              <span>Get access</span>
              <ArrowRight className="w-4 h-4 text-[#e0b25c]" />
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#3a2318]/70">
          <span>Free 2 mock sessions included</span>
          <span>•</span>
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
};
