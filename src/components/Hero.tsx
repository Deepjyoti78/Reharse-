import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative w-full aspect-[16/9] min-h-[560px] md:min-h-[576px] lg:min-h-[640px] flex flex-col justify-start text-[#f6ebd4] pt-16 sm:pt-20 md:pt-22 pb-6 overflow-hidden border-b border-[#3a2318]/20 bg-[#a84420]">
      {/* Art Deco Interview with a Robot background painting */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/art-deco-interview-robot.png"
          alt="Art Deco candidate and AI interviewer"
          className="w-full h-full object-cover object-bottom select-none pointer-events-none"
        />

        {/* Very subtle ambient gradient so the pure artwork colors and texture stay vibrant while maintaining crisp contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#24120a]/30 via-transparent to-[#1f1008]/20 pointer-events-none" />
      </div>

      {/* Hero Content Stack centered exactly in the open wall area */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a130a]/60 border border-[#f6ebd4]/20 text-[#f6ebd4] text-[10.5px] sm:text-[11px] font-sans tracking-[0.16em] uppercase mb-3 sm:mb-3.5 backdrop-blur-xs shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84c]" />
          <span>Interactive AI Interview Practice</span>
        </div>

        {/* Main Headline - Exactly 2 lines matching mockup */}
        <h1 className="font-serif text-[42px] sm:text-[50px] md:text-[56px] lg:text-[62px] leading-[1.04] tracking-tight font-normal text-[#f6ebd4]">
          Interview like you’ve <br />
          <em className="font-serif italic font-normal text-[#fff7ea]">done it before.</em>
        </h1>

        {/* Subtitle - Exactly 2 lines matching mockup */}
        <p className="mt-3 sm:mt-3.5 text-[13px] sm:text-[14px] md:text-[14.5px] text-[#f6ebd4]/85 max-w-[540px] mx-auto font-sans leading-relaxed">
          Rehearse is an AI interviewer that asks real questions,<br className="hidden sm:inline" />
          listens to your answers, and tells you exactly what to fix before the actual day.
        </p>

        {/* Action Buttons */}
        <div className="mt-4 sm:mt-5 flex flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full bg-[#24120a] hover:bg-[#150a05] text-[#f6ebd4] border border-[#f6ebd4]/20 text-xs sm:text-[13.5px] font-medium tracking-wide transition-all shadow-md group hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
            <span>Start a mock interview</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#dfa84c] transition-transform group-hover:translate-x-0.5" />
          </button>
          
          <a
            href="#how"
            className="inline-flex items-center px-5 py-2 sm:py-2.5 rounded-full bg-[#24120a]/40 hover:bg-[#24120a]/70 text-[#f6ebd4] border border-[#f6ebd4]/35 text-xs sm:text-[13.5px] font-medium tracking-wide transition-all backdrop-blur-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            See how it works
          </a>
        </div>

        {/* Social Proof Line */}
        <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[10.5px] sm:text-[11.5px] text-[#f6ebd4]/75 font-sans">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-[#dfa84c]">★</span> 4.9/5 satisfaction rate
          </span>
          <span className="opacity-40">•</span>
          <span>Adaptive follow-ups</span>
          <span className="opacity-40">•</span>
          <span>Instant STAR feedback</span>
        </div>
      </div>
    </section>
  );
};
