import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="relative bg-[#f5ead2] text-[#2a170f] pt-6 sm:pt-8 lg:pt-10 pb-2 sm:pb-4 overflow-hidden border-b border-[#3a2318]/15">
      
      {/* ================= Part A — Header ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-1.5 sm:mb-2">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2a140d] text-[#f6ebd4] text-[11px] font-mono tracking-[0.18em] uppercase mb-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84c]" />
          <span>HOW IT WORKS</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] font-normal tracking-tight text-[#2a170f] leading-[1.06]">
          Practice built for the <br className="hidden sm:inline" />
          interview, <em className="font-serif italic font-normal text-[#9c3a1a]">not the quiz.</em>
        </h2>

        {/* Subtitle */}
        <p className="mt-1.5 text-[13.5px] sm:text-[14.5px] text-[#33251e]/85 max-w-xl mx-auto font-sans leading-relaxed font-normal">
          Unlike static question banks, Rehearse gives you a real, <br className="hidden sm:inline" />
          conversational interview experience.
        </p>
      </div>

      {/* ================= Part B — Main Content Layout ================= */}
      <div className="w-full pl-0 pr-4 sm:pr-8 lg:pr-10 xl:pr-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Shifted more to the left edge and lifted higher above the baseline */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-start self-center lg:self-end ml-0 sm:-ml-2 lg:-ml-6 xl:-ml-10 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8">
            
            {/* Mid-century Architectural Background Color Blocks */}
            <div className="absolute bottom-0 left-0 flex items-end gap-2 z-0 pointer-events-none opacity-95">
              {/* Slate/Teal block behind plant */}
              <div className="w-14 sm:w-16 lg:w-20 h-52 sm:h-64 lg:h-[310px] bg-[#5b8076] rounded-t-sm" />
              {/* Burnt Terracotta tall block behind scholar */}
              <div className="w-16 sm:w-20 lg:w-24 h-64 sm:h-80 lg:h-[380px] bg-[#c45628] rounded-t-sm" />
              {/* Deep ochre/rust block behind lamp/desk */}
              <div className="w-12 sm:w-14 lg:w-16 h-40 sm:h-52 lg:h-[250px] bg-[#9e3e19] rounded-t-sm" />
            </div>

            {/* Thoughtful Scholar at Desk Illustration */}
            <div className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px] drop-shadow-md">
              <img
                src="/images/thoughtful-scholar.png"
                alt="Thoughtful candidate seated at vintage desk reflecting on interview preparation"
                className="w-full h-auto object-contain select-none block"
              />
            </div>
          </div>

          {/* Right Column: 3 Minimalist Steps - tightly integrated and vertically balanced */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-0 pb-4 sm:pb-6 lg:pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 xl:gap-8">
              
              {/* Step 1: Real interview questions */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2.5 sm:mb-3">
                  <span className="font-serif italic text-4xl sm:text-5xl lg:text-[54px] text-[#b4532a] leading-none shrink-0 pr-3 select-none">
                    01
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1.25rem] lg:mr-[-1.5rem] xl:mr-[-2rem] pr-2.5 pl-1">
                    <div className="h-[1.5px] bg-[#3a2318]/20 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b4532a]" />
                  </div>
                </div>
                <h3 className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] font-normal text-[#2a170f] leading-[1.18] mb-1.5 sm:mb-2">
                  Real interview<br />questions
                </h3>
                <p className="font-sans text-[13px] sm:text-[13.5px] text-[#33251e]/85 leading-relaxed font-normal max-w-[260px]">
                  Get role-specific, up-to-date questions that reflect actual industry interviews.
                </p>
              </div>

              {/* Step 2: A natural conversation */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2.5 sm:mb-3">
                  <span className="font-serif italic text-4xl sm:text-5xl lg:text-[54px] text-[#b4532a] leading-none shrink-0 pr-3 select-none">
                    02
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1.25rem] lg:mr-[-1.5rem] xl:mr-[-2rem] pr-2.5 pl-1">
                    <div className="h-[1.5px] bg-[#3a2318]/20 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b4532a]" />
                  </div>
                </div>
                <h3 className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] font-normal text-[#2a170f] leading-[1.18] mb-1.5 sm:mb-2">
                  A natural<br />conversation
                </h3>
                <p className="font-sans text-[13px] sm:text-[13.5px] text-[#33251e]/85 leading-relaxed font-normal max-w-[260px]">
                  Talk to an AI interviewer that listens, asks follow-ups, and adapts to your responses.
                </p>
              </div>

              {/* Step 3: Actionable feedback */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2.5 sm:mb-3">
                  <span className="font-serif italic text-4xl sm:text-5xl lg:text-[54px] text-[#b4532a] leading-none shrink-0 select-none">
                    03
                  </span>
                </div>
                <h3 className="font-serif text-[21px] sm:text-[23px] lg:text-[25px] font-normal text-[#2a170f] leading-[1.18] mb-1.5 sm:mb-2">
                  Actionable<br />feedback
                </h3>
                <p className="font-sans text-[13px] sm:text-[13.5px] text-[#33251e]/85 leading-relaxed font-normal max-w-[260px]">
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
