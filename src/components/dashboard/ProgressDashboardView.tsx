import React from 'react';
import { 
  Target, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const ProgressDashboardView: React.FC = () => {
  const { 
    pastReports, 
    setCurrentView, 
    startInterviewFlow 
  } = useInterview();

  // Calculate aggregates
  const completedCount = pastReports.length;
  const avgScore = completedCount > 0 
    ? Math.round(pastReports.reduce((acc, r) => acc + r.overallScore, 0) / completedCount) 
    : 85;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3a2318]/10 text-[#3a2318] text-[11px] font-mono uppercase tracking-wider mb-2">
            <BarChart3 className="w-3 h-3 text-[#b4532a]" />
            <span>Candidate Analytics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
            Readiness & <em className="italic text-[#b4532a]">Performance Dashboard.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#3a2318]/75 font-sans mt-1">
            Aggregated metrics across your completed interview rounds and targeted growth recommendations.
          </p>
        </div>

        <button
          onClick={() => startInterviewFlow()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
          <span>New Mock Interview</span>
        </button>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#3a2318]/60 block mb-1">
            Average Score
          </span>
          <div className="font-serif text-4xl text-[#2a170f] font-normal leading-tight">
            {avgScore}
            <span className="text-lg text-[#3a2318]/40 font-sans">/100</span>
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            +6.4% improvement this month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#3a2318]/60 block mb-1">
            Completed Rounds
          </span>
          <div className="font-serif text-4xl text-[#2a170f] font-normal leading-tight">
            {completedCount}
          </div>
          <div className="text-[11px] text-[#3a2318]/60 mt-1 font-sans">
            Technical & Behavioral loops
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#3a2318]/60 block mb-1">
            Strongest Domain
          </span>
          <div className="font-serif text-lg text-[#2a170f] font-normal leading-snug line-clamp-1">
            System Architecture
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            Consistent 90%+ bar raiser
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 shadow-xs">
          <span className="text-[11px] font-mono uppercase text-[#3a2318]/60 block mb-1">
            Target Focus Area
          </span>
          <div className="font-serif text-lg text-[#b4532a] font-normal leading-snug line-clamp-1">
            STAR Metric Precision
          </div>
          <div className="text-[11px] text-[#3a2318]/60 mt-1 font-sans">
            Quantify before/after results
          </div>
        </div>
      </div>

      {/* Progress Over Time & Topic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left: Trend Chart Representation */}
        <div className="lg:col-span-7 rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-2xl text-[#2a170f]">Performance Trajectory</h3>
              <span className="text-xs font-mono text-[#5b8076] font-medium">Steady Uptrend</span>
            </div>
            <p className="text-xs text-[#3a2318]/70 font-sans mb-6">
              Evaluation scores plotted across sequential rehearsal sessions.
            </p>
          </div>

          {/* Editorial Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#3a2318]/15 px-2">
            {[
              { label: 'Session 1', score: 68, date: 'Oct 12' },
              { label: 'Session 2', score: 74, date: 'Oct 18' },
              { label: 'Session 3', score: 81, date: 'Oct 24' },
              { label: 'Session 4', score: 88, date: 'Yesterday' }
            ].map((s, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[11px] font-mono font-bold text-[#2a170f]">{s.score}%</span>
                <div
                  className="w-full max-w-[48px] rounded-t-lg bg-[#b4532a] transition-all duration-300 hover:bg-[#97421f]"
                  style={{ height: `${s.score * 1.3}px` }}
                />
                <span className="text-[10px] font-mono text-[#3a2318]/60 mt-1">{s.date}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[#3a2318]/70 font-sans pt-3">
            <span>Baseline: 68%</span>
            <span>Latest: 88% (+20 pts)</span>
          </div>
        </div>

        {/* Right: Recommended Drills */}
        <div className="lg:col-span-5 rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-[#b4532a]" />
              <h3 className="font-serif text-2xl text-[#2a170f]">Recommended Drills</h3>
            </div>
            <p className="text-xs text-[#3a2318]/70 font-sans mb-4">
              AI-generated drills targeted at low-scoring rubric items:
            </p>

            <div className="space-y-3">
              {[
                { title: 'Concurrency & Deadlocks Drill', time: '10 min', diff: 'Hard' },
                { title: 'STAR Story Refinement (Failure & Mistake)', time: '15 min', diff: 'Medium' },
                { title: 'Cache-Aside Invalidation Scenarios', time: '12 min', diff: 'Hard' }
              ].map((drill, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentView('weak-areas')}
                  className="p-3 rounded-xl bg-[#f5e9d0]/70 border border-[#3a2318]/10 hover:border-[#b4532a]/40 hover:bg-[#f2e2be] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#2a170f]">{drill.title}</div>
                    <div className="text-[10.5px] font-mono text-[#3a2318]/60">{drill.time} • {drill.diff}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3a2318]/50" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('weak-areas')}
            className="w-full mt-4 py-2.5 rounded-full bg-[#3a2318] hover:bg-[#28150e] text-[#f8eed8] text-xs font-medium transition-colors cursor-pointer text-center"
          >
            Open Weak Areas Practice Room
          </button>
        </div>
      </div>
    </div>
  );
};
