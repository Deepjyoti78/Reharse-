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
    <div className="min-h-screen bg-[#f3e7c9] text-[#2a1a12] py-4 sm:py-8 font-sans">
      {/* Dynamic Stage Rendering with Stage Entry Transition */}
      <div key={currentStage} className="animate-fade-in-up">
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
