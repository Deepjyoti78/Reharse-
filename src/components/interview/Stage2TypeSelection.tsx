import React from 'react';
import { 
  Code2, 
  Users2, 
  Briefcase, 
  Binary, 
  Layers, 
  Sliders, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import type { InterviewType } from '../../types/interview';

interface TypeCardOption {
  type: InterviewType;
  title: string;
  category: string;
  description: string;
  evaluatedOn: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentBg: string;
}

const INTERVIEW_TYPES: TypeCardOption[] = [
  {
    type: 'technical',
    title: 'Technical Interview',
    category: 'Architecture & Fundamentals',
    description: 'Deep conceptual rigor on programming paradigms, design patterns, framework internals, and trade-offs.',
    evaluatedOn: [
      'Technical accuracy & depth',
      'System design & architecture intuition',
      'Language semantics & framework runtime',
      'Trade-off justification under constraints'
    ],
    icon: Code2,
    accentColor: '#b4532a', // Rust
    accentBg: 'rgba(180, 83, 42, 0.1)'
  },
  {
    type: 'behavioral',
    title: 'Behavioral Interview',
    category: 'Leadership & STAR Stories',
    description: 'Structured situational scenarios exploring interpersonal dynamics, resilience, ownership, and stakeholder management.',
    evaluatedOn: [
      'STAR structure (Situation, Task, Action, Result)',
      'Constructive conflict resolution',
      'Extreme ownership & blameless postmortems',
      'Team elevation & communication empathy'
    ],
    icon: Users2,
    accentColor: '#5b8076', // Sage
    accentBg: 'rgba(91, 128, 118, 0.1)'
  },
  {
    type: 'hr',
    title: 'HR & Culture Round',
    category: 'Trajectory & Motivation',
    description: 'Evaluates career alignment, cultural ethos, self-awareness, salary/trajectory expectations, and foundational rapport.',
    evaluatedOn: [
      'Authentic career narrative & elevator pitch',
      'Alignment with organizational principles',
      'Self-awareness regarding growth areas',
      'Workplace resilience & energy management'
    ],
    icon: Briefcase,
    accentColor: '#dfa84c', // Gold
    accentBg: 'rgba(223, 168, 76, 0.12)'
  },
  {
    type: 'coding',
    title: 'Coding & Algorithmic Problem',
    category: 'Data Structures & Complexity',
    description: 'Interactive algorithmic problem solving with live space-time complexity analysis and edge case consideration.',
    evaluatedOn: [
      'Optimal Big-O Time & Space complexity',
      'Clean modular implementation',
      'Edge case anticipation (null, bounds, overflow)',
      'Clear verbal think-aloud problem solving'
    ],
    icon: Binary,
    accentColor: '#3a2318', // Choc
    accentBg: 'rgba(58, 35, 24, 0.1)'
  },
  {
    type: 'mixed',
    title: 'Mixed Full-Loop Interview',
    category: 'Comprehensive Assessment',
    description: 'A realistic blended simulation alternating between technical deep-dives, past project war stories, and behavioral questions.',
    evaluatedOn: [
      'Cross-disciplinary mental agility',
      'Bridging technical depth with business impact',
      'Handling shifting context between domains',
      'End-to-end engineering maturity'
    ],
    icon: Layers,
    accentColor: '#b4532a',
    accentBg: 'rgba(180, 83, 42, 0.1)'
  },
  {
    type: 'custom',
    title: 'Custom User-Defined Interview',
    category: 'Personalized Prompting',
    description: 'Tailor the interview precisely around your upcoming company round, specific technologies, or specific questions.',
    evaluatedOn: [
      'User-provided custom rubric criteria',
      'Niche toolchain or domain expertise',
      'Targeted weak-area remediation',
      'Customized pushback and question depth'
    ],
    icon: Sliders,
    accentColor: '#7d3418',
    accentBg: 'rgba(125, 52, 24, 0.1)'
  }
];

export const Stage2TypeSelection: React.FC = () => {
  const { config, updateConfig, setCurrentStage } = useInterview();

  const handleSelectType = (type: InterviewType) => {
    updateConfig({ interviewType: type });
  };

  const handleContinue = () => {
    setCurrentStage('configuration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStage('intro');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 md:py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Choose your <em className="italic text-[#b4532a]">interview track.</em>
        </h2>
        <p className="mt-2 text-sm text-[#3a2318]/75 font-sans">
          Select the focus of your session. Each track uses calibrated questioning models and specific evaluation rubrics.
        </p>
      </div>

      {/* Grid of 6 Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INTERVIEW_TYPES.map((card) => {
          const isSelected = config.interviewType === card.type;
          const Icon = card.icon;

          return (
            <div
              key={card.type}
              onClick={() => handleSelectType(card.type)}
              className={`relative rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#faf1dc] border-[#b4532a] shadow-md ring-2 ring-[#b4532a]/30 -translate-y-1'
                  : 'bg-[#faf4e6] border-[#3a2318]/15 hover:border-[#3a2318]/35 hover:bg-[#faf1dd] hover:shadow-xs'
              }`}
            >
              <div>
                {/* Top Row: Icon + Category + Selection badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: card.accentBg, color: card.accentColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#b4532a] text-[#fbf7ee] text-[11px] font-medium font-sans shadow-2xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    <span className="text-[10.5px] uppercase tracking-wider font-mono text-[#3a2318]/50">
                      {card.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-[22px] text-[#2a170f] leading-snug font-normal mb-2">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#3a2318]/80 leading-relaxed font-sans mb-4">
                  {card.description}
                </p>

                {/* Evaluated On Section */}
                <div className="pt-2">
                  <div className="text-[10.5px] uppercase tracking-wider font-mono text-[#3a2318]/60 mb-2 font-medium">
                    Evaluated on:
                  </div>
                  <ul className="space-y-1.5">
                    {card.evaluatedOn.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11.5px] text-[#3a2318]/85 font-sans leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b4532a]/60 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom selection indicator */}
              <div className="mt-5 pt-3 flex items-center justify-between text-xs font-sans">
                <span className={`font-medium ${isSelected ? 'text-[#b4532a]' : 'text-[#3a2318]/60'}`}>
                  {isSelected ? 'Track selected' : 'Click to select track'}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full transition-all ${isSelected ? 'bg-[#b4532a] ring-4 ring-[#b4532a]/20' : 'bg-[#3a2318]/20'}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={handleBack}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
          <span>Back to overview</span>
        </button>

        <button
          onClick={handleContinue}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Continue to Configuration</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
