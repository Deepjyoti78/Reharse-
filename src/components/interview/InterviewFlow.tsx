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

  // Instantly reset scroll to top on stage change without "down to up" scrolling
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStage]);

  // If in live room, render full virtual room without setup header
  if (currentStage === 'live-room') {
    return (
      <div key="live-room" className="animate-fade-in">
        <Stage8LiveRoom />
      </div>
    );
  }

  // If in processing transition
  if (currentStage === 'processing') {
    return (
      <div key="processing" className="animate-fade-in">
        <Stage9Processing />
      </div>
    );
  }

  // If in performance report
  if (currentStage === 'report') {
    return (
      <div key="report" className="relative min-h-screen bg-[#f3e7c9] text-[#2a1a12] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans animate-fade-in overflow-x-hidden">
        {/* Outer Architectural Blueprint Grid Pattern - Uniform across report view */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(90, 52, 32, 0.11) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(90, 52, 32, 0.11) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative z-10 w-full">
          <Stage9Report />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f3e7c9] text-[#2a1a12] py-4 sm:py-6 px-2.5 sm:px-6 lg:px-8 font-sans flex flex-col justify-start sm:justify-center overflow-x-hidden">
      {/* Outer Architectural Blueprint Grid Pattern - Uniform across the whole page */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90, 52, 32, 0.11) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90, 52, 32, 0.11) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Dynamic Stage Rendering with Stage Entry Transition */}
      <div key={currentStage} className="relative z-10 w-full animate-fade-in">
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
