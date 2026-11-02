import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';

export const ExpectationSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const followUps = [
    {
      title: "Vague Metric Pushback",
      quote: "“You said you improved performance. By how much, and how did you measure it?”",
      context: "Triggered when candidate mentions 'making things faster' without p95/p99 latency benchmarks or resource metrics.",
      img: "/images/rehearse/ai-interviewer/pushback-probing-robot.webp",
      alt: "Robot interviewer probing candidate vague metric"
    },
    {
      title: "Team vs. Personal Ownership",
      quote: "“You kept using 'we' for that architecture rebuild. What was your personal design contribution, and where did you disagree with the team?”",
      context: "Triggered when candidate avoids specifying direct individual decisions.",
      img: "/images/rehearse/feedback/metric-verification.webp",
      alt: "Diagnostic radar verifying candidate ownership"
    },
    {
      title: "Failure & Blameless Post-Mortem",
      quote: "“If this system went down under 10x Black Friday traffic, what is the single catastrophic failure point in your design?”",
      context: "Triggered in system design rounds to assess resilience and humility.",
      img: "/images/rehearse/ai-interviewer/pushback-probing-robot.webp",
      alt: "Interviewer evaluating edge cases"
    },
    {
      title: "Trade-off Justification",
      quote: "“Why did you choose PostgreSQL over DynamoDB for this write-heavy time-series pipeline? What was the dealbreaker?”",
      context: "Triggered to verify deep architectural judgment beyond resume buzzwords.",
      img: "/images/rehearse/feedback/metric-verification.webp",
      alt: "Technical trade-off analysis chart"
    }
  ];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % followUps.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + followUps.length) % followUps.length);

  return (
    <section className="relative bg-[#a84420] text-[#f3e7c9] text-center overflow-hidden py-28 sm:py-36 px-6 sm:px-12 border-b border-[#3a2318]/30">
      {/* Concentric Acoustic Radar Rings SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="#7d3418" strokeWidth="2">
          <circle cx="500" cy="300" r="100" />
          <circle cx="500" cy="300" r="200" />
          <circle cx="500" cy="300" r="320" />
          <circle cx="500" cy="300" r="460" />
          <circle cx="500" cy="300" r="620" />
        </g>
      </svg>

      {/* Atmospheric Radial Gradient */}
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#a84420]/50 to-[#7d3418] pointer-events-none" />

      {/* Massive Background Typography */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[130px] leading-[0.88] tracking-tighter text-[#772d14] font-normal select-none mb-6 sm:mb-10">
          What you <br />
          can expect
        </h2>

        {/* Floating Card: Unscripted Follow-up with Editorial Artwork */}
        <div className="relative mx-auto max-w-2xl bg-[#f3e7c9] text-[#2a1a12] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#3a2318]/20 text-left">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Visual Thumbnail Container */}
            <div className="sm:col-span-5 rounded-xl overflow-hidden aspect-[4/3] border border-[#3a2318]/15 bg-[#3a2318] shadow-sm">
              <img
                src={followUps[activeIndex].img}
                alt={followUps[activeIndex].alt}
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
              />
            </div>

            {/* Text and context */}
            <div className="sm:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#3a2318]/10 pb-2.5 mb-3">
                  <div className="flex items-center gap-2 text-[#b4532a]">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-mono font-semibold tracking-wider uppercase">
                      {followUps[activeIndex].title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#3a2318]/60">
                    {activeIndex + 1} of {followUps.length}
                  </span>
                </div>

                <p className="font-serif text-lg sm:text-xl text-[#2a1a12] leading-snug italic mb-3">
                  {followUps[activeIndex].quote}
                </p>

                <p className="text-xs text-[#3a2318]/75 leading-relaxed bg-[#e4d5b8]/60 p-2.5 rounded-lg border border-[#3a2318]/10">
                  <strong>Interviewer rationale:</strong> {followUps[activeIndex].context}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#3a2318]/10">
                <span className="text-xs text-[#3a2318]/70 flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-[#b4532a]" />
                  Unscripted Pushback
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-full border border-[#3a2318]/20 flex items-center justify-center hover:bg-[#3a2318] hover:text-[#f3e7c9] transition-colors"
                    aria-label="Previous question"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-7 h-7 rounded-full border border-[#3a2318]/20 flex items-center justify-center hover:bg-[#3a2318] hover:text-[#f3e7c9] transition-colors"
                    aria-label="Next question"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
