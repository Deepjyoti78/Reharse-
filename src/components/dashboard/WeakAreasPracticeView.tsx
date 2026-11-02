import React from 'react';
import { 
  Target, 
  ArrowLeft, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

interface PracticeDrill {
  id: string;
  topic: string;
  category: 'Technical' | 'Behavioral' | 'Architecture';
  description: string;
  difficulty: string;
  estimatedTime: string;
  targetRubric: string;
}

const WEAK_AREA_DRILLS: PracticeDrill[] = [
  {
    id: 'drill-1',
    topic: 'Distributed Caching & Thundering Herd',
    category: 'Technical',
    description: 'Drill on cache stampede, probabilistic early expiration (XFetch), and Redis Lua distributed locks under flash sale conditions.',
    difficulty: 'Hard',
    estimatedTime: '10 Mins',
    targetRubric: 'Technical Accuracy & Trade-offs'
  },
  {
    id: 'drill-2',
    topic: 'Quantified STAR Story Framing (Ownership & Failure)',
    category: 'Behavioral',
    description: 'Structure a blameless post-mortem response with concrete business metrics (latency drop, saved revenue, test automation).',
    difficulty: 'Medium',
    estimatedTime: '12 Mins',
    targetRubric: 'STAR Structure & Quantified Impact'
  },
  {
    id: 'drill-3',
    topic: 'Cross-Service Idempotency & Saga Pattern',
    category: 'Architecture',
    description: 'Justify compensating transactions vs 2-phase commit in an asynchronous event-driven payment workflow.',
    difficulty: 'Hard',
    estimatedTime: '15 Mins',
    targetRubric: 'System Design & Failure Modes'
  },
  {
    id: 'drill-4',
    topic: 'React 18/19 Fiber Reconciliation & Layout Thrashing',
    category: 'Technical',
    description: 'Explain work-in-progress fiber trees, concurrent time slicing, and GPU compositing vs reflow performance.',
    difficulty: 'Medium',
    estimatedTime: '10 Mins',
    targetRubric: 'Framework Mechanics & Rendering Pipeline'
  }
];

export const WeakAreasPracticeView: React.FC = () => {
  const { setCurrentView, startInterviewFlow, updateConfig } = useInterview();

  const handleStartDrill = (drill: PracticeDrill) => {
    updateConfig({
      jobRole: drill.topic,
      difficulty: drill.difficulty as any,
      questionCount: 3,
      durationMinutes: 10
    });
    startInterviewFlow(drill.topic, drill.category === 'Behavioral' ? 'behavioral' : 'technical');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-sans">
      {/* Return button */}
      <button
        onClick={() => setCurrentView('landing')}
        className="inline-flex items-center gap-1.5 text-xs text-[#3a2318]/70 hover:text-[#3a2318] mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4532a]/10 text-[#b4532a] text-[11px] font-mono uppercase tracking-wider mb-2">
          <Target className="w-3.5 h-3.5 text-[#b4532a]" />
          <span>Focused Deliberate Practice</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Practice Your <em className="italic text-[#b4532a]">Weak Areas.</em>
        </h1>
        <p className="text-xs sm:text-sm text-[#3a2318]/75 font-sans mt-1 max-w-2xl">
          Rather than repeating full 45-minute loops, run focused 10-minute micro-drills targeting the exact concepts and questions where your scores dipped.
        </p>
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {WEAK_AREA_DRILLS.map((drill) => (
          <div
            key={drill.id}
            className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs hover:border-[#b4532a]/40 hover:bg-[#faf2de] transition-all flex flex-col justify-between interactive-card"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#3a2318]/10 text-[#3a2318] font-medium">
                  {drill.category}
                </span>
                <div className="flex items-center gap-2 text-xs font-mono text-[#3a2318]/60">
                  <span>{drill.estimatedTime}</span>
                  <span>•</span>
                  <span className="text-[#b4532a] font-semibold">{drill.difficulty}</span>
                </div>
              </div>

              <h3 className="font-serif text-xl sm:text-[22px] text-[#2a170f] font-normal leading-snug mb-2">
                {drill.topic}
              </h3>

              <p className="text-xs text-[#3a2318]/80 font-sans leading-relaxed mb-4">
                {drill.description}
              </p>

              <div className="text-[11px] font-mono text-[#5b8076] bg-[#5b8076]/10 px-3 py-1.5 rounded-lg mb-4">
                Target Rubric: {drill.targetRubric}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartDrill(drill)}
              className="w-full py-2.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] text-white text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
              <span>Launch 10-Min Focused Drill</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
