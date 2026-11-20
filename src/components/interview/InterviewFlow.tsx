import React, { useLayoutEffect } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { instantScrollToTop } from '../../utils/scroll';
import { WavyRoadmapTracker } from './WavyRoadmapTracker';
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
  const { currentStage, stageDirection } = useInterview();

  // Instantly reset scroll to top on stage change without "down to up" scrolling
  useLayoutEffect(() => {
    instantScrollToTop();
  }, [currentStage]);

  // If in live room, render full virtual room without setup header
  if (currentStage === 'live-room') {
    return (
      <div key="live-room" className="animate-stage-forward">
        <Stage8LiveRoom />
      </div>
    );
  }

  // If in processing transition
  if (currentStage === 'processing') {
    return (
      <div key="processing" className="animate-stage-forward">
        <Stage9Processing />
      </div>
    );
  }

  // If in performance report
  if (currentStage === 'report') {
    return (
      <div key="report" className="relative min-h-screen bg-[#f3e7c9] text-[#2a1a12] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans animate-stage-forward overflow-x-hidden">
        {/* Outer Architectural Blueprint Grid Pattern - Visible purely in empty canvas areas */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.25] z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(90, 52, 32, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(90, 52, 32, 0.12) 1px, transparent 1px)
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
    <div className="relative min-h-screen bg-[#f3e7c9] text-[#2a1a12] pt-4 sm:pt-7 lg:pt-8 pb-12 px-2.5 sm:px-6 lg:px-8 font-sans flex flex-col justify-start overflow-x-hidden">
      {/* Outer Architectural Blueprint Grid Pattern - Clean, non-multiplying outer backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.25] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90, 52, 32, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90, 52, 32, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Architectural Wavy Dotted Roadmap Tracker Connecting All 8 Stages */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-1 sm:px-2">
        <WavyRoadmapTracker />
      </div>

      {/* Dynamic Stage Rendering with Directional Slide Transition */}
      <div 
        key={currentStage} 
        className={`relative z-10 w-full ${
          stageDirection === 'forward' ? 'animate-stage-forward' : 'animate-stage-backward'
        }`}
      >
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
