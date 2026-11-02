import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { Stage1Intro } from './Stage1Intro';
import { Stage2TypeSelection } from './Stage2TypeSelection';
import { Stage3Configuration } from './Stage3Configuration';
import { Stage4Personalization } from './Stage4Personalization';
import { Stage5InterviewerSelection } from './Stage5InterviewerSelection';
import { Stage6SummaryPreview } from './Stage6SummaryPreview';
import { Stage7DeviceCheck } from './Stage7DeviceCheck';
import { Stage8LiveRoom } from './Stage8LiveRoom';
import { Stage9Processing } from './Stage9Processing';
import { Stage9Report } from './Stage9Report';

const SETUP_STEPS = [
  { id: 'type-selection', label: 'Track' },
  { id: 'configuration', label: 'Settings' },
  { id: 'personalization', label: 'Context' },
  { id: 'interviewer', label: 'Persona' },
  { id: 'preview', label: 'Review' },
  { id: 'device-check', label: 'Hardware' }
];

export const InterviewFlow: React.FC = () => {
  const { currentStage, exitToDashboard, setCurrentStage } = useInterview();

  // If in live room, render full virtual room without setup header
  if (currentStage === 'live-room') {
    return <Stage8LiveRoom />;
  }

  // If in processing transition
  if (currentStage === 'processing') {
    return <Stage9Processing />;
  }

  // If in performance report
  if (currentStage === 'report') {
    return <Stage9Report />;
  }

  const currentStepIndex = SETUP_STEPS.findIndex(s => s.id === currentStage);

  return (
    <div className="min-h-screen bg-[#f3e7c9] text-[#2a1a12] pt-6 pb-16 font-sans">
      {/* Top Header Stepper (visible on setup stages 2 through 7) */}
      {currentStage !== 'intro' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#3a2318]/15">
            <button
              onClick={exitToDashboard}
              className="inline-flex items-center gap-1.5 text-xs text-[#3a2318]/70 hover:text-[#3a2318] font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Setup</span>
            </button>

            {/* Stepper Dots & Labels */}
            <div className="hidden sm:flex items-center gap-2">
              {SETUP_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex > idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isPassed) {
                          setCurrentStage(step.id as any);
                        }
                      }}
                      disabled={!isPassed}
                      className={`inline-flex items-center gap-1.5 text-xs font-mono transition-all ${
                        isCurrent
                          ? 'text-[#b4532a] font-bold'
                          : isPassed
                          ? 'text-[#3a2318]/80 hover:text-[#3a2318] cursor-pointer'
                          : 'text-[#3a2318]/30 cursor-not-allowed'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isPassed
                            ? 'bg-emerald-700 text-white'
                            : isCurrent
                            ? 'bg-[#b4532a] text-white shadow-xs'
                            : 'bg-[#3a2318]/15 text-[#3a2318]/60'
                        }`}
                      >
                        {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                      </span>
                      <span>{step.label}</span>
                    </button>
                    {idx < SETUP_STEPS.length - 1 && (
                      <span className="w-4 h-[1px] bg-[#3a2318]/20" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="text-xs font-mono text-[#3a2318]/60 sm:hidden">
              Step {currentStepIndex + 1} of {SETUP_STEPS.length}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Stage Rendering */}
      <div className="animate-in fade-in duration-200">
        {currentStage === 'intro' && <Stage1Intro />}
        {currentStage === 'type-selection' && <Stage2TypeSelection />}
        {currentStage === 'configuration' && <Stage3Configuration />}
        {currentStage === 'personalization' && <Stage4Personalization />}
        {currentStage === 'interviewer' && <Stage5InterviewerSelection />}
        {currentStage === 'preview' && <Stage6SummaryPreview />}
        {currentStage === 'device-check' && <Stage7DeviceCheck />}
      </div>
    </div>
  );
};
