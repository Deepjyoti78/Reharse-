import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="relative bg-[#f5ead2] text-[#2a170f] pt-3 sm:pt-4 lg:pt-5 pb-1 sm:pb-2 overflow-hidden border-b border-[#3a2318]/15">
      
      {/* ================= Part A — Header ================= */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-0 sm:mb-1">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#2a140d] text-[#f6ebd4] text-[10.5px] font-mono tracking-[0.18em] uppercase mb-1 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#dfa84c]" />
          <span>HOW IT WORKS</span>
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-normal tracking-tight text-[#2a170f] leading-[1.06]">
          Practice built for the <br className="hidden sm:inline" />
          interview, <em className="font-serif italic font-normal text-[#9c3a1a]">not the quiz.</em>
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-[13px] sm:text-[14px] text-[#33251e]/85 max-w-xl mx-auto font-sans leading-relaxed font-normal">
          Unlike static question banks, Rehearse gives you a real, <br className="hidden sm:inline" />
          conversational interview experience.
        </p>
      </div>

      {/* ================= Part B — Main Content Layout ================= */}
      <div className="w-full pl-0 pr-4 sm:pr-8 lg:pr-10 xl:pr-12 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center">
          
          {/* Left Column: Shifted to the left edge with increased height to reduce empty space above */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-start self-center lg:self-end ml-0 sm:-ml-2 lg:-ml-6 xl:-ml-10 -translate-y-3 sm:-translate-y-5 lg:-translate-y-7">
            
            {/* Mid-century Architectural Background Color Blocks */}
            <div className="absolute bottom-0 left-0 flex items-end gap-1.5 z-0 pointer-events-none opacity-95">
              {/* Slate/Teal block behind plant */}
              <div className="w-14 sm:w-16 lg:w-20 h-48 sm:h-60 lg:h-[300px] bg-[#5b8076] rounded-t-sm" />
              {/* Burnt Terracotta tall block behind scholar */}
              <div className="w-16 sm:w-20 lg:w-24 h-60 sm:h-72 lg:h-[365px] bg-[#c45628] rounded-t-sm" />
              {/* Deep ochre/rust block behind lamp/desk */}
              <div className="w-12 sm:w-14 lg:w-18 h-40 sm:h-50 lg:h-[235px] bg-[#9e3e19] rounded-t-sm" />
            </div>

            {/* Thoughtful Scholar at Desk Illustration - increased size & height */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] xl:max-w-[465px] drop-shadow-md">
              <img
                src="/images/thoughtful-scholar.png"
                alt="Thoughtful candidate seated at vintage desk reflecting on interview preparation"
                className="w-full h-auto object-contain select-none block"
              />
            </div>
          </div>

          {/* Right Column: 3 Minimalist Steps - shifted to the right side */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-0 pb-1 sm:pb-3 lg:pb-4 lg:pl-8 xl:pl-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 xl:gap-7">
              
              {/* Step 1: Real interview questions */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="font-serif italic text-4xl sm:text-[46px] lg:text-[50px] text-[#b4532a] leading-none shrink-0 pr-3 select-none">
                    01
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1rem] lg:mr-[-1.25rem] xl:mr-[-1.75rem] pr-2.5 pl-1">
                    <div className="h-[1.5px] bg-[#3a2318]/20 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b4532a]" />
                  </div>
                </div>
                <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] font-normal text-[#2a170f] leading-[1.18] mb-1 sm:mb-1.5">
                  Real interview<br />questions
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#33251e]/85 leading-relaxed font-normal max-w-[240px]">
                  Get role-specific, up-to-date questions that reflect actual industry interviews.
                </p>
              </div>

              {/* Step 2: A natural conversation */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="font-serif italic text-4xl sm:text-[46px] lg:text-[50px] text-[#b4532a] leading-none shrink-0 pr-3 select-none">
                    02
                  </span>
                  <div className="hidden md:flex items-center flex-1 relative mr-[-1rem] lg:mr-[-1.25rem] xl:mr-[-1.75rem] pr-2.5 pl-1">
                    <div className="h-[1.5px] bg-[#3a2318]/20 w-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#b4532a]" />
                  </div>
                </div>
                <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] font-normal text-[#2a170f] leading-[1.18] mb-1 sm:mb-1.5">
                  A natural<br />conversation
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#33251e]/85 leading-relaxed font-normal max-w-[240px]">
                  Talk to an AI interviewer that listens, asks follow-ups, and adapts to your responses.
                </p>
              </div>

              {/* Step 3: Actionable feedback */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="font-serif italic text-4xl sm:text-[46px] lg:text-[50px] text-[#b4532a] leading-none shrink-0 select-none">
                    03
                  </span>
                </div>
                <h3 className="font-serif text-[19px] sm:text-[21px] lg:text-[23px] font-normal text-[#2a170f] leading-[1.18] mb-1 sm:mb-1.5">
                  Actionable<br />feedback
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#33251e]/85 leading-relaxed font-normal max-w-[240px]">
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
