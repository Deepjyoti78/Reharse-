import React, { useRef, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import type { InterviewStage } from '../../types/interview';
import { instantScrollToTop } from '../../utils/scroll';

export interface StageNode {
  id: InterviewStage;
  num: string;
  title: string;
  subtitle: string;
}

export const ROADMAP_STAGES: StageNode[] = [
  { id: 'intro', num: '01', title: 'Overview', subtitle: 'Setup Intro' },
  { id: 'type-selection', num: '02', title: 'Choose Track', subtitle: 'Format & Type' },
  { id: 'configuration', num: '03', title: 'Configure', subtitle: 'Role & Level' },
  { id: 'personalization', num: '04', title: 'Context & JD', subtitle: 'Resume & Match' },
  { id: 'interviewer', num: '05', title: 'AI Persona', subtitle: 'Voice & Tone' },
  { id: 'preview', num: '06', title: 'Blueprint', subtitle: 'Evaluation Rubric' },
  { id: 'device-check', num: '07', title: 'Tech Check', subtitle: 'Mic & Hardware' },
  { id: 'live-room', num: '08', title: 'Live Arena', subtitle: 'Simulated Session' },
];

// Precision coordinates for 8 checkpoints across 1000px width with an undulating wavy curve
const NODE_COORDINATES: Array<{ x: number; y: number }> = [
  { x: 58, y: 38 },
  { x: 184, y: 22 },
  { x: 310, y: 52 },
  { x: 436, y: 22 },
  { x: 562, y: 52 },
  { x: 688, y: 22 },
  { x: 814, y: 52 },
  { x: 942, y: 38 },
];

export const WavyRoadmapTracker: React.FC = () => {
  const { currentStage, setCurrentStage } = useInterview();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Map current stage into 0-7 roadmap index
  const currentStageIndex = Math.max(
    0,
    ROADMAP_STAGES.findIndex(s => s.id === currentStage)
  );

  const currentStageDef = ROADMAP_STAGES[currentStageIndex] || ROADMAP_STAGES[0];
  const nextStageDef = ROADMAP_STAGES[currentStageIndex + 1];

  // Auto-scroll on mobile / small screens to center active stage node
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeCoord = NODE_COORDINATES[currentStageIndex];
    if (activeCoord && container.scrollWidth > container.clientWidth) {
      const targetX = (activeCoord.x / 1000) * container.scrollWidth - container.clientWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetX),
        behavior: 'smooth'
      });
    }
  }, [currentStageIndex]);

  // Cubic Bézier wavy path generator
  const buildWavyPath = (endIndex: number): string => {
    if (endIndex <= 0) return '';
    let d = `M ${NODE_COORDINATES[0].x} ${NODE_COORDINATES[0].y}`;
    for (let i = 0; i < endIndex; i++) {
      const p0 = NODE_COORDINATES[i];
      const p1 = NODE_COORDINATES[i + 1];
      const dx = (p1.x - p0.x) * 0.5;
      d += ` C ${(p0.x + dx).toFixed(1)} ${p0.y}, ${(p1.x - dx).toFixed(1)} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const fullGuidePath = buildWavyPath(7);
  const activeWavyPath = currentStageIndex > 0 ? buildWavyPath(currentStageIndex) : '';

  const handleStageNavigation = (stageId: InterviewStage, index: number) => {
    // Enable jump to any visited/completed stage or current stage
    if (index <= currentStageIndex) {
      setCurrentStage(stageId);
      instantScrollToTop();
    }
  };

  return (
    <div className="w-full rounded-2xl bg-[#faf0d8]/90 border border-[#3a2318]/15 shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-xs transition-all">
      {/* Tracker Status Bar */}
      <div className="flex items-center justify-between gap-2 mb-2 px-1 text-xs font-sans">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b4532a]/10 border border-[#b4532a]/20 text-[#b4532a] font-mono text-[11px] font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b4532a] animate-pulse" />
            STEP {currentStageDef.num} OF 08
          </span>
          <span className="hidden sm:inline text-[#2a170f] font-medium">
            {currentStageDef.title}
          </span>
          <span className="hidden md:inline text-[#3a2318]/50 text-[11px]">
            ({currentStageDef.subtitle})
          </span>
        </div>

        {nextStageDef ? (
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#3a2318]/70">
            <span className="text-[#3a2318]/50 hidden xs:inline">Next in flow:</span>
            <span className="font-semibold text-[#b4532a]">{nextStageDef.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#b4532a] animate-pulse" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-[#5b8076] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
            <span>Ready for Live Interview</span>
          </div>
        )}
      </div>

      {/* Horizontally scrollable SVG wave container */}
      <div 
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar py-1"
      >
        <svg
          viewBox="0 0 1000 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full min-w-[720px] max-w-full h-auto select-none"
        >
          {/* Subtle glow filter definition for active streaming flow */}
          <defs>
            <filter id="activeLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#b4532a" floodOpacity="0.45" />
            </filter>
            <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7d3418" />
              <stop offset="60%" stopColor="#b4532a" />
              <stop offset="100%" stopColor="#dfa84c" />
            </linearGradient>
          </defs>

          {/* 1. Background Inactive Dotted Guide Curve */}
          <path
            d={fullGuidePath}
            stroke="rgba(58, 35, 24, 0.22)"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          {/* 2. Active Flowing Wavy Curve with Animated Dots Moving to the Right */}
          {activeWavyPath && (
            <>
              {/* Soft Warm Halo behind active path */}
              <path
                d={activeWavyPath}
                stroke="rgba(180, 83, 42, 0.25)"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Foreground Animated Streaming Dotted Path */}
              <path
                d={activeWavyPath}
                stroke="url(#activeGradient)"
                strokeWidth="3.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
                className="animate-flow-dots"
                filter="url(#activeLineGlow)"
              />
            </>
          )}

          {/* 3. Checkpoint Nodes (01 through 08) */}
          {ROADMAP_STAGES.map((stage, idx) => {
            const coord = NODE_COORDINATES[idx];
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isClickable = idx <= currentStageIndex;

            return (
              <g
                key={stage.id}
                onClick={() => handleStageNavigation(stage.id, idx)}
                className={`transition-all duration-200 ${
                  isClickable ? 'cursor-pointer group' : 'cursor-default opacity-85'
                }`}
                role={isClickable ? 'button' : 'group'}
                tabIndex={isClickable ? 0 : -1}
                aria-label={`Step ${stage.num}: ${stage.title} (${
                  isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'
                })`}
              >
                {/* Active Stage Pulsing Ripple Aura */}
                {isCurrent && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="20"
                    fill="rgba(180, 83, 42, 0.22)"
                    className="animate-node-pulse"
                  />
                )}

                {/* Main Node Disc */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isCurrent ? 14 : isCompleted ? 12 : 10.5}
                  fill={
                    isCurrent
                      ? '#b4532a'
                      : isCompleted
                      ? '#2a170f'
                      : '#ebdcc2'
                  }
                  stroke={
                    isCurrent
                      ? '#fff3da'
                      : isCompleted
                      ? '#dfa84c'
                      : 'rgba(58, 35, 24, 0.35)'
                  }
                  strokeWidth={isCurrent ? 2.5 : isCompleted ? 2 : 1.5}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                {/* Node Center Content: Checkmark for completed, Step number for active/upcoming */}
                {isCompleted ? (
                  <text
                    x={coord.x}
                    y={coord.y + 3.5}
                    textAnchor="middle"
                    fill="#dfa84c"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="select-none pointer-events-none"
                  >
                    ✓
                  </text>
                ) : (
                  <text
                    x={coord.x}
                    y={coord.y + 3.5}
                    textAnchor="middle"
                    fill={isCurrent ? '#ffffff' : 'rgba(58, 35, 24, 0.7)'}
                    fontSize={isCurrent ? '10' : '9'}
                    fontWeight={isCurrent ? 'bold' : '600'}
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    {stage.num}
                  </text>
                )}

                {/* Stage Title Label Below Node */}
                <text
                  x={coord.x}
                  y={76}
                  textAnchor="middle"
                  fill={
                    isCurrent
                      ? '#b4532a'
                      : isCompleted
                      ? '#2a170f'
                      : 'rgba(58, 35, 24, 0.55)'
                  }
                  fontSize={isCurrent ? '11.5' : '10.5'}
                  fontWeight={isCurrent ? '700' : isCompleted ? '600' : '500'}
                  fontFamily="system-ui, sans-serif"
                  className="select-none pointer-events-none group-hover:fill-[#b4532a] transition-colors"
                >
                  {stage.title}
                </text>

                {/* Stage Status Subtitle */}
                <text
                  x={coord.x}
                  y={88}
                  textAnchor="middle"
                  fill={
                    isCurrent
                      ? '#7d3418'
                      : isCompleted
                      ? '#5b8076'
                      : 'rgba(58, 35, 24, 0.4)'
                  }
                  fontSize="8.5"
                  fontWeight="600"
                  letterSpacing="0.04em"
                  className="select-none pointer-events-none uppercase"
                >
                  {isCurrent ? '• Active' : isCompleted ? 'Done' : 'Pending'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
