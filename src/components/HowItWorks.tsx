import React from 'react';
import { FileText, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Real interview questions",
      desc: "Get role-specific, up-to-date questions that reflect actual industry interviews.",
      icon: <FileText className="w-4 h-4 text-[#fdfaf3]" />,
      badgeBg: "bg-[#b8542c]"
    },
    {
      number: "02",
      title: "A natural conversation",
      desc: "Talk to an AI interviewer that listens, asks follow-ups, and adapts to your responses.",
      icon: <MessageSquare className="w-4 h-4 text-[#fdfaf3]" />,
      badgeBg: "bg-[#5b8076]"
    },
    {
      number: "03",
      title: "Actionable feedback",
      desc: "Get clear, structured feedback with strengths, gaps, and practical ways to improve.",
      icon: <TrendingUp className="w-4 h-4 text-[#fdfaf3]" />,
      badgeBg: "bg-[#9c3a1a]"
    }
  ];

  return (
    <section id="how" className="relative bg-[#f6ebd4] text-[#2a170f] pt-10 sm:pt-12 pb-0 overflow-hidden border-b border-[#3a2318]/15">
      
      {/* ================= Part A — Header ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-3 sm:mb-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a140d] text-[#f6ebd4] text-[11px] font-mono tracking-[0.18em] uppercase mb-2 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84c]" />
          <span>HOW IT WORKS</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-[52px] lg:text-[58px] font-normal tracking-tight text-[#2a170f] leading-[1.04]">
          Practice built for the <br className="hidden sm:inline" />
          interview, <em className="font-serif italic font-normal text-[#9c3a1a]">not the quiz.</em>
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-[14px] sm:text-[15px] text-[#33251e]/85 max-w-xl mx-auto font-sans leading-relaxed font-normal">
          Unlike static question banks, Rehearse gives you a real, <br className="hidden sm:inline" />
          conversational interview experience.
        </p>
      </div>

      {/* ================= Part B — Main Content Layout ================= */}
      <div className="w-full pl-0 pr-4 sm:pr-8 lg:pr-12 xl:pr-16 lg:-mb-14 xl:-mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          
          {/* Left Column: Shifted right and lifted so image bottom matches the dark strip bottom */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-start self-end ml-0 sm:ml-4 lg:ml-10 xl:ml-14 -translate-y-2 sm:-translate-y-4 align-scholar-bottom">
            
            {/* Mid-century Architectural Background Color Blocks */}
            <div className="absolute bottom-0 left-0 flex items-end gap-2.5 z-0 pointer-events-none opacity-95">
              {/* Slate/Teal block behind plant */}
              <div className="w-16 sm:w-20 lg:w-24 h-64 sm:h-80 lg:h-[390px] bg-[#5b8076] rounded-t-sm" />
              {/* Burnt Terracotta tall block behind scholar */}
              <div className="w-20 sm:w-24 lg:w-28 h-80 sm:h-[400px] lg:h-[470px] bg-[#c45628] rounded-t-sm" />
              {/* Deep ochre/rust block behind lamp/desk */}
              <div className="w-14 sm:w-16 lg:w-20 h-52 sm:h-64 lg:h-[310px] bg-[#9e3e19] rounded-t-sm" />
            </div>

            {/* Thoughtful Scholar at Desk Illustration */}
            <div className="relative z-10 w-full max-w-[460px] sm:max-w-[510px] lg:max-w-[550px] drop-shadow-md">
              <img
                src="/images/thoughtful-scholar.png"
                alt="Thoughtful candidate seated at vintage desk reflecting on interview preparation"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Right Column: 3 Feature Cards Shifted Above + Snug Experience Text Strip */}
          <div className="lg:col-span-7 flex flex-col justify-start lg:self-start mt-2 sm:mt-4 lg:mt-7 xl:mt-8 pb-0 space-y-3.5">
            
            {/* 3 Process Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-2.5 xl:gap-3 items-center">
              
              {/* Card 1: Real interview questions */}
              <div className="relative bg-[#f3e7c9] rounded-2xl p-5 sm:p-6 border border-[#3a2318]/15 shadow-[0_6px_20px_rgba(58,35,24,0.06)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group min-h-[210px] sm:min-h-[225px] flex flex-col justify-between">
                {/* SVG Corner Tab Badge matching rounded corner */}
                <div className="absolute top-0 left-0 w-22 h-11 overflow-hidden rounded-tl-2xl">
                  <svg viewBox="0 0 88 44" className="w-full h-full fill-[#b8542c]" preserveAspectRatio="none">
                    <path d="M0,0 L88,0 L62,44 L0,44 Z" />
                  </svg>
                  <div className="absolute top-0 left-0 w-14 h-11 flex items-center justify-center pl-2">
                    {steps[0].icon}
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="font-serif text-lg font-normal text-[#a07246]">
                    {steps[0].number}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-[21px] sm:text-[22px] font-normal text-[#2a170f] leading-snug mb-1.5 group-hover:text-[#b8542c] transition-colors">
                    {steps[0].title}
                  </h3>
                  <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                    {steps[0].desc}
                  </p>
                </div>
              </div>

              {/* Connecting Arrow 1 -> 2 */}
              <div className="hidden md:flex items-center justify-center text-[#b8542c]/50 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Card 2: A natural conversation */}
              <div className="relative bg-[#f3e7c9] rounded-2xl p-5 sm:p-6 border border-[#3a2318]/15 shadow-[0_6px_20px_rgba(58,35,24,0.06)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group min-h-[210px] sm:min-h-[225px] flex flex-col justify-between">
                {/* SVG Corner Tab Badge matching rounded corner */}
                <div className="absolute top-0 left-0 w-22 h-11 overflow-hidden rounded-tl-2xl">
                  <svg viewBox="0 0 88 44" className="w-full h-full fill-[#5b8076]" preserveAspectRatio="none">
                    <path d="M0,0 L88,0 L62,44 L0,44 Z" />
                  </svg>
                  <div className="absolute top-0 left-0 w-14 h-11 flex items-center justify-center pl-2">
                    {steps[1].icon}
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="font-serif text-lg font-normal text-[#a07246]">
                    {steps[1].number}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-[21px] sm:text-[22px] font-normal text-[#2a170f] leading-snug mb-1.5 group-hover:text-[#5b8076] transition-colors">
                    {steps[1].title}
                  </h3>
                  <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                    {steps[1].desc}
                  </p>
                </div>
              </div>

              {/* Connecting Arrow 2 -> 3 */}
              <div className="hidden md:flex items-center justify-center text-[#b8542c]/50 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Card 3: Actionable feedback */}
              <div className="relative bg-[#f3e7c9] rounded-2xl p-5 sm:p-6 border border-[#3a2318]/15 shadow-[0_6px_20px_rgba(58,35,24,0.06)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group min-h-[210px] sm:min-h-[225px] flex flex-col justify-between">
                {/* SVG Corner Tab Badge matching rounded corner */}
                <div className="absolute top-0 left-0 w-22 h-11 overflow-hidden rounded-tl-2xl">
                  <svg viewBox="0 0 88 44" className="w-full h-full fill-[#9c3a1a]" preserveAspectRatio="none">
                    <path d="M0,0 L88,0 L62,44 L0,44 Z" />
                  </svg>
                  <div className="absolute top-0 left-0 w-14 h-11 flex items-center justify-center pl-2">
                    {steps[2].icon}
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="font-serif text-lg font-normal text-[#a07246]">
                    {steps[2].number}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-[21px] sm:text-[22px] font-normal text-[#2a170f] leading-snug mb-1.5 group-hover:text-[#9c3a1a] transition-colors">
                    {steps[2].title}
                  </h3>
                  <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                    {steps[2].desc}
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Audio Experience Information Strip: Positioned Snugly Under Cards */}
            <div className="w-full bg-[#23120a] text-[#f6ebd4] rounded-2xl h-[56px] sm:h-[62px] px-5 sm:px-7 shadow-md flex items-center justify-center sm:justify-start gap-3.5 sm:gap-5 border border-[#dfa84c]/20">
              
              {/* Soundwave Visual */}
              <div className="flex items-center gap-1 h-5 shrink-0">
                {[35, 65, 95, 55, 30, 85, 45, 100, 75, 40, 70, 90, 50, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-[#dfa84c] rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>

              {/* Vertical Separator */}
              <span className="w-[1px] h-4 bg-[#dfa84c]/30 shrink-0" />

              {/* Experience Tagline Text */}
              <p className="font-serif italic text-[15px] sm:text-[16.5px] text-[#f6ebd4] tracking-wide leading-none truncate">
                A real interview experience, from question to feedback.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Sage Green Connecting Transition Bar at Section Bottom */}
      <div className="w-full h-4 sm:h-5 bg-[#a9b5a0] border-t border-[#3a2318]/10" />
    </section>
  );
};
