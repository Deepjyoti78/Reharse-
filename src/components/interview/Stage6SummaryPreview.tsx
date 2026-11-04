import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Mic, 
  UserCheck
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const Stage6SummaryPreview: React.FC = () => {
  const { 
    config, 
    resume, 
    jobDescription, 
    selectedInterviewer, 
    setCurrentStage 
  } = useInterview();

  const isTechnical = config.interviewType === 'technical' || config.interviewType === 'coding';

  const evaluationCriteria = isTechnical ? [
    { title: 'Technical Rigor', desc: 'Accurate architectural principles, language mechanics, and stack mastery.' },
    { title: 'Problem-Solving & Tradeoffs', desc: 'Exploring alternative approaches, Big-O trade-offs, and failure recovery.' },
    { title: 'Conceptual Clarity', desc: 'Deconstructing complex concepts without relying on superficial buzzwords.' },
    { title: 'Communication Cadence', desc: 'Concise articulation, structured pacing, and active listening to hints.' },
    { title: 'Answer Architecture', desc: 'Framing high-level context first before diving into low-level implementation details.' }
  ] : [
    { title: 'Communication Clarity', desc: 'Clear narrative arc, authentic vocal presence, and succinct delivery.' },
    { title: 'Situational Reasoning', desc: 'Demonstrating sound engineering judgment and stakeholder empathy.' },
    { title: 'Answer Relevance & Depth', desc: 'Directly addressing the interviewer’s specific question prompt.' },
    { title: 'STAR Structure & Quantified Impact', desc: 'Clear Situation, Task, Action, and measurable business Results.' },
    { title: 'Growth Mindset & Ownership', desc: 'Blameless retrospectives and constructive conflict resolution.' }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-2 sm:py-4 pb-20 sm:pb-24 animate-fade-in-up">
      {/* Header with localized fading grid halo behind heading & subtext */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div 
          className="absolute -inset-x-16 -inset-y-6 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, #f3e7c9 50%, rgba(243, 231, 201, 0) 100%)',
            filter: 'blur(16px)',
          }}
        />
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Interview summary & <em className="italic text-[#b4532a]">evaluation rubric.</em>
        </h2>
        <p className="mt-2 text-sm sm:text-[15px] text-[#3a2318]/80 font-sans max-w-xl mx-auto leading-relaxed">
          Review your configured session parameters and evaluation benchmarks before initializing the virtual interview room.
        </p>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Main Summary Grid */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#3a2318]/10 pb-4 mb-5">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-[#b4532a]">
                Interview Blueprint
              </div>
              <h3 className="font-serif text-2xl text-[#2a170f]">
                {config.jobRole} — {config.interviewType.toUpperCase()}
              </h3>
            </div>

            <button
              onClick={() => setCurrentStage('configuration')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f] text-xs font-medium transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Settings</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Track</span>
              <span className="font-medium text-[#2a170f] capitalize">{config.interviewType} Interview</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Experience</span>
              <span className="font-medium text-[#2a170f]">{config.experienceLevel}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Difficulty</span>
              <span className="font-medium text-[#b4532a] font-semibold">{config.difficulty}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Planned Duration</span>
              <span className="font-medium text-[#2a170f]">{config.durationMinutes} Minutes</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Questions</span>
              <span className="font-medium text-[#2a170f]">{config.questionCount} Questions</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Language</span>
              <span className="font-medium text-[#2a170f]">{config.language}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">AI Disposition</span>
              <span className="font-medium text-[#2a170f]">{config.aiTone}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f5e9d0]/70">
              <span className="text-[#3a2318]/60 block font-mono text-[10.5px] uppercase">Interviewer</span>
              <span className="font-medium text-[#2a170f]">{selectedInterviewer.name} ({selectedInterviewer.accent})</span>
            </div>
          </div>

          {/* Resume & JD Status */}
          <div className="mt-5 pt-4 border-t border-[#3a2318]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#3a2318]/70">Candidate Resume:</span>
              {resume ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{resume.fileName} ({resume.skills.length} skills parsed)</span>
                </span>
              ) : (
                <span className="text-[#3a2318]/50 italic">None attached (Standard questions)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#3a2318]/70">Job Description:</span>
              {jobDescription ? (
                <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Aligned ({jobDescription.keySkills.length} competencies)</span>
                </span>
              ) : (
                <span className="text-[#3a2318]/50 italic">None attached</span>
              )}
            </div>
          </div>
        </div>

        {/* What You'll Be Evaluated On */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-5 h-5 text-[#b4532a]" />
            <h3 className="font-serif text-xl sm:text-2xl text-[#2a170f]">What You’ll Be Evaluated On</h3>
          </div>
          <p className="text-xs text-[#3a2318]/75 font-sans mb-4">
            Our AI scoring rubric benchmarks your answers against candidate bars established at leading technology firms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {evaluationCriteria.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#f7eed9] border border-[#3a2318]/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-[#b4532a] text-[#fdfaf3] flex items-center justify-center text-[10px] font-mono font-bold">
                    {idx + 1}
                  </span>
                  <div className="font-serif text-base text-[#2a170f] font-normal">{item.title}</div>
                </div>
                <p className="text-xs text-[#3a2318]/80 font-sans leading-relaxed pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Guidelines & Audio Warning */}
        <div className="rounded-2xl bg-[#f2e6cb] border border-[#3a2318]/20 p-5 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#3a2318] text-[#f8eed8] flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 text-[#dfa84c]" />
          </div>
          <div className="flex-1 text-xs text-[#3a2318]/90 font-sans leading-relaxed">
            <div className="font-serif text-lg text-[#2a170f] mb-0.5">
              Pre-Interview Checklist & Audio Reminder
            </div>
            <p className="mb-2">
              For the most realistic experience, use a working microphone in a quiet room. You can also type answers or use speech simulation if preferred. Next, we will verify your microphone levels and audio connection.
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] font-medium text-[#3a2318]">
              <span>✓ Quiet surroundings</span>
              <span>✓ Working headphones / microphone</span>
              <span>✓ 10–30 mins undisturbed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent / Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#faf3e3]/95 backdrop-blur-md border-t border-[#3a2318]/15 px-4 py-3 sm:py-3.5 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStage('interviewer')}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs sm:text-sm font-medium font-sans border border-[#3a2318]/20 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
            <span>Back to Interviewer</span>
          </button>

          <button
            onClick={() => {
              setCurrentStage('device-check');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Next: Proceed to Hardware Check</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
