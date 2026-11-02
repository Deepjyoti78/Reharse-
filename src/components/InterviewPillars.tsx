import React, { useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';

export const InterviewPillars: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null);

  const pillars = [
    {
      tag: "Technical Depth",
      title: "Questions with depth",
      desc: "Distributed system architecture, data structure trade-offs, and project deep-dives that adapt to your target seniority.",
      img: "/images/rehearse/practice/technical-depth-challenge.webp",
      alt: "Candidate exploring technical problem with algorithmic schematic",
      details: [
        "Architectural tradeoff scenarios (CAP theorem, caching, sharding)",
        "Deep dives into concurrency, memory management, and latency",
        "Realistic live debugging scenarios under pressure"
      ]
    },
    {
      tag: "Behavioural (STAR)",
      title: "Stories that land",
      desc: "Master the STAR method so the tangible outcome—not the backstory—is what interviewers remember.",
      img: "/images/rehearse/practice/behavioural-storytelling.webp",
      alt: "Candidate articulating structured behavioral response with calm conviction",
      details: [
        "Constructive conflict resolution with product managers and peers",
        "Clear articulation of personal ownership versus team contributions",
        "Demonstrating resilience and post-mortem accountability"
      ]
    },
    {
      tag: "Actionable Feedback",
      title: "A debrief, not a grade",
      desc: "See what to change in each answer, ranked by how much it moves your score with actionable rewrites.",
      img: "/images/rehearse/feedback/precision-feedback-debrief.webp",
      alt: "Line-by-line editorial debrief report analyzing clarity and sentence impact",
      details: [
        "Line-by-line sentence critiques with suggested high-impact phrasing",
        "Pacing, filler word analysis, and conciseness ratio",
        "Comparative benchmark against calibrated candidate responses"
      ]
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#f3e7c9] text-[#2a1a12] border-b border-[#3a2318]/10">
      <div className="max-w-6xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#b4532a] bg-[#e4d5b8] px-3.5 py-1 rounded-full border border-[#b4532a]/20">
          Holistic Evaluation
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#2a1a12] mt-4 mb-4 leading-[1.08]">
          Designed around how <br />
          interviews actually go
        </h2>
        <p className="text-base sm:text-lg text-[#3a2318]/80 max-w-lg mx-auto mb-16 font-normal">
          Every question evaluates both technical substance and conversational conviction.
        </p>

        {/* 3 Illustrated Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPillar(selectedPillar === idx ? null : idx)}
              className="group bg-[#e4d5b8] hover:bg-[#decbb0] transition-all duration-300 rounded-2xl p-5 border border-[#3a2318]/15 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Visual Editorial Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-[#3a2318]/10 border border-[#3a2318]/15 shadow-inner">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#3a2318]/85 backdrop-blur-xs text-[#f3e7c9] text-[11px] font-mono px-2.5 py-1 rounded-md">
                    {item.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="px-1">
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2a1a12] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#3a2318]/85 font-normal">
                    {item.desc}
                  </p>

                  {/* Expandable details */}
                  {selectedPillar === idx && (
                    <div className="mt-4 pt-4 border-t border-[#3a2318]/15 space-y-2 animate-in fade-in duration-300">
                      {item.details.map((detail, di) => (
                        <div key={di} className="flex items-start gap-2 text-xs text-[#2a1a12]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b4532a] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#3a2318]/15 flex items-center justify-between text-xs font-medium text-[#b4532a] px-1">
                <span>{selectedPillar === idx ? "Hide breakdown" : "Click to explore details"}</span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${selectedPillar === idx ? 'rotate-90' : ''}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <a
            href="#roles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#3a2318] text-[#3a2318] hover:bg-[#3a2318] hover:text-[#f3e7c9] transition-all text-sm font-medium"
          >
            Explore supported role tracks
          </a>
        </div>
      </div>
    </section>
  );
};
