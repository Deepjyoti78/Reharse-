import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { Connector1To2, ConnectorBetweenStages } from './StageConnectors';
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
      <div key="report" className="relative min-h-screen bg-[#f3e7c9] text-[#2a170f] py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans animate-fade-in overflow-x-hidden">
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
    <div className="relative min-h-screen bg-[#f3e7c9] text-[#2a170f] pt-6 sm:pt-10 pb-24 px-2.5 sm:px-6 lg:px-8 font-sans flex flex-col justify-start overflow-x-hidden">
      {/* Outer Architectural Blueprint Grid Pattern */}
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

      {/* Sequential Connected Cards Flow with Physical Dotted Connectors */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Section 1: Intro Setup Card */}
        <section id="stage-1-intro" className="w-full scroll-mt-6">
          <Stage1Intro />
        </section>

        {/* Dotted Line Connector: Leaves Stage 1 Boundary under the Right Image, Forks into Stage 2 */}
        <Connector1To2 />

        {/* Section 2: Choose Interview Track */}
        <section id="stage-2-type-selection" className="w-full scroll-mt-6">
          <Stage2TypeSelection />
        </section>

        {/* Dotted Line Connector: Stage 2 -> Stage 3 */}
        <ConnectorBetweenStages title="Configure Setup" sourceX={500} targetX={500} />

        {/* Section 3: Configuration & Settings */}
        <section id="stage-3-configuration" className="w-full scroll-mt-6">
          <Stage3Configuration />
        </section>

        {/* Dotted Line Connector: Stage 3 -> Stage 4 */}
        <ConnectorBetweenStages title="Context & Resume" sourceX={500} targetX={500} />

        {/* Section 4: Personalization (Resume & JD) */}
        <section id="stage-4-personalization" className="w-full scroll-mt-6">
          <Stage4Personalization />
        </section>

        {/* Dotted Line Connector: Stage 4 -> Stage 5 */}
        <ConnectorBetweenStages title="Select AI Persona" sourceX={500} targetX={500} />

        {/* Section 5: AI Interviewer Selection */}
        <section id="stage-5-interviewer" className="w-full scroll-mt-6">
          <Stage5InterviewerSelection />
        </section>

        {/* Dotted Line Connector: Stage 5 -> Stage 6 */}
        <ConnectorBetweenStages title="Summary & Blueprint" sourceX={500} targetX={500} />

        {/* Section 6: Summary & Blueprint Rubric */}
        <section id="stage-6-preview" className="w-full scroll-mt-6">
          <Stage6SummaryPreview />
        </section>

        {/* Dotted Line Connector: Stage 6 -> Stage 7 */}
        <ConnectorBetweenStages title="Hardware Check" sourceX={500} targetX={500} />

        {/* Section 7: Device & Microphone Check */}
        <section id="stage-7-device-check" className="w-full scroll-mt-6">
          <Stage7DeviceCheck />
        </section>

      </div>
    </div>
  );
};
