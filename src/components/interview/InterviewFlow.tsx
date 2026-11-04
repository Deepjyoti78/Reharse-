import React from 'react';
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

export const InterviewFlow: React.FC = () => {
  const { currentStage } = useInterview();

  // If in live room, render full virtual room without setup header
  if (currentStage === 'live-room') {
    return (
      <div key="live-room" className="animate-fade-in-up">
        <Stage8LiveRoom />
      </div>
    );
  }

  // If in processing transition
  if (currentStage === 'processing') {
    return (
      <div key="processing" className="animate-fade-in-up">
        <Stage9Processing />
      </div>
    );
  }

  // If in performance report
  if (currentStage === 'report') {
    return (
      <div key="report" className="animate-fade-in-up">
        <Stage9Report />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen md:h-screen md:max-h-screen bg-[#f3e7c9] text-[#2a1a12] py-2 px-3 sm:px-6 font-sans md:overflow-hidden flex flex-col justify-center">
      {/* Outer Architectural Blueprint Grid Pattern with Fading Effect around Header Typography */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.38] mix-blend-multiply z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90, 52, 32, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90, 52, 32, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 48% at 50% 20%, transparent 22%, black 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 48% at 50% 20%, transparent 22%, black 78%)',
        }}
      />

      {/* Gentle Spotlight Radial Mask dissolving grid directly behind the heading and subtext */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-[#f3e7c9] blur-3xl opacity-85 pointer-events-none z-0" />

      {/* Dynamic Stage Rendering with Stage Entry Transition */}
      <div key={currentStage} className="relative z-10 w-full animate-fade-in-up">
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
