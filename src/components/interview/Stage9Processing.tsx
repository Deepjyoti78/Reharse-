import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

const PROCESSING_STEPS = [
  'Saving interview responses and audio telemetry...',
  'Processing conversational transcript and cadence...',
  'Evaluating answers against role rubric & STAR criteria...',
  'Analyzing technical accuracy and architectural trade-offs...',
  'Generating personalized feedback and exemplary answers...',
  'Finalizing performance scorecard and learning roadmap...'
];

export const Stage9Processing: React.FC = () => {
  const { setCurrentStage } = useInterview();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setCurrentStage('report');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(stepInterval);
  }, [setCurrentStage]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="rounded-3xl bg-[#faf3e3] border border-[#3a2318]/15 p-8 sm:p-12 max-w-xl w-full text-center shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#dfa84c]/20 blur-2xl pointer-events-none" />

        {/* Central Animated Illustration / Icon */}
        <div className="relative w-20 h-20 rounded-2xl bg-[#3a2318] text-[#dfa84c] flex items-center justify-center mx-auto mb-6 shadow-md border border-[#3a2318]/30">
          <Brain className="w-10 h-10 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#b4532a] text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4532a]/10 text-[#b4532a] text-[11px] font-mono uppercase tracking-wider mb-3">
          <span>AI Evaluation Engine v2.4</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight mb-2">
          Generating your <br />
          <em className="italic text-[#b4532a]">Performance Report.</em>
        </h2>

        <p className="text-xs sm:text-sm text-[#3a2318]/75 font-sans mb-8">
          Our scoring models are analyzing your conversational answers, structure, and trade-off justifications.
        </p>

        {/* Step-by-Step Progress List */}
        <div className="space-y-3 text-left max-w-md mx-auto mb-8 font-sans">
          {PROCESSING_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                  isDone
                    ? 'text-[#2a170f]'
                    : isCurrent
                    ? 'text-[#b4532a] font-medium'
                    : 'text-[#3a2318]/30'
                }`}
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  ) : isCurrent ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#b4532a] animate-ping" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-[#3a2318]/20" />
                  )}
                </div>
                <span>{step}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#3a2318]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Strictly private & benchmarked against FAANG rubrics</span>
        </div>
      </div>
    </div>
  );
};

