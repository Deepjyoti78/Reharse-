import React, { useState } from 'react';
import { Terminal, Database, Users, GraduationCap, ArrowUpRight } from 'lucide-react';

interface RolesSectionProps {
  onSelectRole: (roleTitle: string) => void;
}

export const RolesSection: React.FC<RolesSectionProps> = ({ onSelectRole }) => {
  const [activeRoleIndex, setActiveRoleIndex] = useState<number>(0);

  const roles = [
    {
      title: "Software engineering",
      subtitle: "Algorithms, distributed system design & project walkthroughs",
      desc: "Tailored for campus grads, mid-level SWEs, and Staff/Principal architects. Covers algorithmic optimization, microservice tradeoffs, concurrency, and DB scalability.",
      icon: <Terminal className="w-5 h-5 text-[#b4532a]" />,
      img: "/images/rehearse/interview/roles-software-engineering.webp",
      alt: "Software systems architecture and code analysis illustration",
      sampleQuestion: "“Design a globally distributed rate-limiter that maintains sub-5ms latency and handles network partitions between EU and US clusters.”",
      topics: ["System Design", "Distributed Caching", "API Idempotency", "Database Sharding"]
    },
    {
      title: "Data & analytics",
      subtitle: "SQL, business metrics & root-cause case analysis",
      desc: "Tests how you reason under business uncertainty rather than memorizing formulaic queries. Formulate hypotheses, debug data anomalies, and present findings to leadership.",
      icon: <Database className="w-5 h-5 text-[#b4532a]" />,
      img: "/images/rehearse/analytics/roles-data-analytics.webp",
      alt: "Data metrics dashboard and business case analysis",
      sampleQuestion: "“Weekly active users dropped 14% after the latest checkout release, but overall revenue remained flat. How do you triage this data anomaly?”",
      topics: ["A/B Testing", "Funnel Conversion", "SQL Optimization", "Metric Decomposition"]
    },
    {
      title: "HR & managerial rounds",
      subtitle: "Executive presence, stakeholder conflict & leadership pushback",
      desc: "‘Tell me about yourself’, difficult colleague relationships, prioritization crises, and high-stakes executive alignment with unscripted pushback.",
      icon: <Users className="w-5 h-5 text-[#b4532a]" />,
      img: "/images/rehearse/interview/roles-executive-leadership.webp",
      alt: "Executive leadership negotiation and stakeholder alignment",
      sampleQuestion: "“Tell me about a time an executive wanted to ship a feature by Friday that your engineering team deemed fundamentally insecure. How did you negotiate?”",
      topics: ["Stakeholder Negotiation", "Constructive Conflict", "Failure Ownership", "STAR Storytelling"]
    },
    {
      title: "Internships & freshers",
      subtitle: "Clear foundational reasoning & academic project articulation",
      desc: "Entry-level mock rounds that reward fundamental problem-solving, intellectual curiosity, and concise project explanations when you have limited corporate experience.",
      icon: <GraduationCap className="w-5 h-5 text-[#b4532a]" />,
      img: "/images/rehearse/learning/roles-internships-freshers.webp",
      alt: "College graduate preparing projects and computer science fundamentals",
      sampleQuestion: "“Walk me through your college capstone project. What was the most complex bug you personally solved, and what did you learn from it?”",
      topics: ["Foundations", "CS Fundamentals", "Curiosity & Grit", "Capstone Deep-dive"]
    }
  ];

  return (
    <section id="roles" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#e4d5b8] text-[#2a1a12] border-b border-[#3a2318]/15">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (Sticky heading & Active Role Feature Card) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#b4532a] bg-[#f3e7c9] px-3.5 py-1.5 rounded-full border border-[#b4532a]/20">
              Coverage &amp; Verticals
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#2a1a12] mt-4 leading-[1.05] tracking-tight">
              One interviewer, <br />
              every kind of role
            </h2>
            <p className="mt-4 text-base text-[#3a2318]/80 leading-relaxed font-normal">
              Whether you are preparing for FAANG system design, consulting case interviews, or your very first internship, Rehearse calibrates its expectations to your exact level.
            </p>

            {/* Editorial Showcase Card for Active Role with Smooth Transition */}
            <div className="mt-8 p-5 rounded-2xl bg-[#f3e7c9] border border-[#3a2318]/15 shadow-md hidden sm:block">
              <div key={activeRoleIndex} className="animate-fade-in-up">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-[#3a2318]/10 bg-[#3a2318]">
                  <img
                    src={roles[activeRoleIndex].img}
                    alt={roles[activeRoleIndex].alt}
                    className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#3a2318]/85 text-[#f3e7c9] text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded">
                    {roles[activeRoleIndex].title} Track
                  </div>
                </div>

                <p className="text-xs font-mono uppercase tracking-wider text-[#b4532a] mb-1 font-semibold">
                  Quick Simulation
                </p>
                <p className="text-sm text-[#2a1a12] mb-3">
                  Experience realistic pushback calibrated for this role.
                </p>
                <button
                  onClick={() => onSelectRole(roles[activeRoleIndex].title)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#3a2318] text-[#f3e7c9] hover:bg-[#26150e] transition-all text-xs font-medium cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Launch {roles[activeRoleIndex].title} round</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#e0b25c]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Cards stack with thumbnails) */}
          <div className="lg:col-span-7 space-y-4">
            {roles.map((r, i) => (
              <div
                key={i}
                onClick={() => setActiveRoleIndex(i)}
                className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  activeRoleIndex === i
                    ? 'bg-[#f3e7c9] border-[#b4532a] shadow-lg -translate-y-0.5'
                    : 'bg-[#f3e7c9]/70 border-[#3a2318]/10 hover:bg-[#f3e7c9] hover:border-[#3a2318]/25'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#e4d5b8] flex items-center justify-center shrink-0 border border-[#3a2318]/10 overflow-hidden">
                      <img
                        src={r.img}
                        alt={r.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2a1a12]">
                        {r.title}
                      </h3>
                      <p className="text-xs font-mono text-[#b4532a] mt-0.5">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-mono transition-colors shrink-0 ${
                    activeRoleIndex === i ? 'bg-[#b4532a] text-[#f3e7c9]' : 'bg-[#e4d5b8] text-[#3a2318]'
                  }`}>
                    {activeRoleIndex === i ? 'Active' : 'Select'}
                  </span>
                </div>

                <p className="text-sm sm:text-[14.5px] text-[#3a2318]/85 mt-4 leading-relaxed font-normal">
                  {r.desc}
                </p>

                {/* Expanded question preview for selected role */}
                {activeRoleIndex === i && (
                  <div className="mt-5 pt-4 border-t border-[#3a2318]/15 animate-in fade-in duration-300">
                    <div className="p-3.5 rounded-xl bg-[#e4d5b8]/70 border border-[#3a2318]/10">
                      <p className="text-[11px] font-mono uppercase text-[#b4532a] font-semibold mb-1">
                        Sample Probing Question:
                      </p>
                      <p className="font-serif italic text-sm text-[#2a1a12]">
                        {r.sampleQuestion}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3 items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {r.topics.map((t, ti) => (
                          <span
                            key={ti}
                            className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#3a2318]/10 text-[#2a1a12]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRole(r.title);
                        }}
                        className="text-xs font-semibold text-[#b4532a] hover:underline flex items-center gap-1 mt-2 sm:mt-0"
                      >
                        Practice this track →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
