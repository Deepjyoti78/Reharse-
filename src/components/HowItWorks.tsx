import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="relative bg-[#f5ead2] text-[#2a170f] pt-10 sm:pt-14 pb-0 overflow-hidden border-b border-[#3a2318]/15">
      
      {/* ================= Part A — Header ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-6 sm:mb-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a140d] text-[#f6ebd4] text-[11px] font-mono tracking-[0.18em] uppercase mb-2.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84c]" />
          <span>HOW IT WORKS</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl sm:text-5xl md:text-[52px] lg:text-[58px] font-normal tracking-tight text-[#2a170f] leading-[1.04]">
          Practice built for the <br className="hidden sm:inline" />
          interview, <em className="font-serif italic font-normal text-[#9c3a1a]">not the quiz.</em>
        </h2>

        {/* Subtitle */}
        <p className="mt-2.5 text-[14px] sm:text-[15px] text-[#33251e]/85 max-w-xl mx-auto font-sans leading-relaxed font-normal">
          Unlike static question banks, Rehearse gives you a real, <br className="hidden sm:inline" />
          conversational interview experience.
        </p>
      </div>

      {/* ================= Part B — Main Content Layout ================= */}
      <div className="w-full pl-0 pr-4 sm:pr-8 lg:pr-12 xl:pr-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          
          {/* Left Column: Thoughtful Scholar Illustration & Background Color Blocks */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-start self-end ml-0 sm:ml-4 lg:ml-6">
            
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
            <div className="relative z-10 w-full max-w-[460px] sm:max-w-[510px] lg:max-w-[540px] drop-shadow-md">
              <img
                src="/images/thoughtful-scholar.png"
                alt="Thoughtful candidate seated at vintage desk reflecting on interview preparation"
                className="w-full h-auto object-contain select-none block"
              />
            </div>
          </div>

          {/* Right Column: 3 Minimalist Steps connected by delicate hairline rules with centered dots */}
          <div className="lg:col-span-7 flex flex-col justify-center pb-8 sm:pb-12 lg:pb-16 pt-4 lg:pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10">
              
              {/* Step 1: Real interview questions */}
              <div className="flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="font-serif italic text-5xl sm:text-[56px] text-[#b8542c] leading-none shrink-0 pr-3 select-none">
                    01
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1.5rem] lg:mr-[-2rem] xl:mr-[-2.5rem] pr-3 pl-1">
                    <div className="h-[1px] bg-[#3a2318]/25 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b8542c]" />
                  </div>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] lg:text-[26px] font-normal text-[#2a170f] leading-snug mb-2 sm:mb-2.5">
                  Real interview<br />questions
                </h3>
                <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                  Get role-specific, up-to-date questions that reflect actual industry interviews.
                </p>
              </div>

              {/* Step 2: A natural conversation */}
              <div className="flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="font-serif italic text-5xl sm:text-[56px] text-[#b8542c] leading-none shrink-0 pr-3 select-none">
                    02
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1.5rem] lg:mr-[-2rem] xl:mr-[-2.5rem] pr-3 pl-1">
                    <div className="h-[1px] bg-[#3a2318]/25 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b8542c]" />
                  </div>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] lg:text-[26px] font-normal text-[#2a170f] leading-snug mb-2 sm:mb-2.5">
                  A natural<br />conversation
                </h3>
                <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                  Talk to an AI interviewer that listens, asks follow-ups, and adapts to your responses.
                </p>
              </div>

              {/* Step 3: Actionable feedback */}
              <div className="flex flex-col">
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="font-serif italic text-5xl sm:text-[56px] text-[#b8542c] leading-none shrink-0 select-none">
                    03
                  </span>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] lg:text-[26px] font-normal text-[#2a170f] leading-snug mb-2 sm:mb-2.5">
                  Actionable<br />feedback
                </h3>
                <p className="font-sans text-[13.5px] sm:text-[14px] text-[#33251e]/80 leading-relaxed font-normal">
                  Get clear, structured feedback with strengths, gaps, and practical ways to improve.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
