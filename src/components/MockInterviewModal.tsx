import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: string;
}

interface QuestionScenario {
  img: string;
  question: string;
  context: string;
  level: string;
  vagueAnswer: string;
  vagueScore: number;
  vagueFlagged: string;
  vagueRewrite: string;
  vagueFollowUp: string;
  starAnswer: string;
  starScore: number;
  starFlagged: string;
  starRewrite: string;
  starFollowUp: string;
}

const SCENARIOS: Record<string, QuestionScenario> = {
  "Software engineering": {
    img: "/images/rehearse/interview/roles-software-engineering.webp",
    question: "“In your resume, you mention optimizing a PostgreSQL checkout query pipeline. Can you walk me through the bottleneck and how you measured the improvement?”",
    context: "Senior Backend / Distributed Systems",
    level: "L5 / Senior Level",
    vagueAnswer: "We noticed checkout was really sluggish during sale events, so our team worked together to rewrite a bunch of queries and add indexes. We also set up some caching with Redis and it felt much faster afterwards.",
    vagueScore: 54,
    vagueFlagged: "“it felt much faster afterwards” — Missing telemetry metrics and baseline p95/p99 latency numbers.",
    vagueRewrite: "“p99 database query latency dropped from 420ms to 48ms, measured via pg_stat_statements and Datadog APM.”",
    vagueFollowUp: "“What specific indexes did you add, and what was the impact on table write amplification?”",
    starAnswer: "During our peak holiday flash sale, checkout p99 latency spiked to 420ms, causing 2.8% connection timeouts. I analyzed pg_stat_statements and identified a missing composite B-Tree index on (tenant_id, created_at) and an N+1 query loading cart items. I eliminated the N+1 with eager joins and introduced a Redis read-through cache with a 5-minute TTL. This brought p99 query latency down to 48ms and dropped CPU utilization from 88% to 34%.",
    starScore: 94,
    starFlagged: "Minor nuance: consider specifying the cache eviction policy during concurrent inventory modifications.",
    starRewrite: "Exemplary STAR structure with quantified baseline metrics, clear personal agency, and architectural tradeoffs.",
    starFollowUp: "“Excellent breakdown. How did you handle cache invalidation when item inventory changed concurrently?”"
  },
  "Data & analytics": {
    img: "/images/rehearse/analytics/roles-data-analytics.webp",
    question: "“User retention dropped 12% following a major onboarding redesign, but daily active signups reached an all-time high. How would you diagnose this?”",
    context: "Product Analytics & Growth Metrics",
    level: "Senior Analyst / Lead",
    vagueAnswer: "I would check Google Analytics and ask the design team what changed. We’d probably send out a survey to users asking why they left and then recommend rolling back the change if people hated it.",
    vagueScore: 48,
    vagueFlagged: "“recommend rolling back the change if people hated it” — Reactive conclusion without cohort segmentation.",
    vagueRewrite: "“Decompose retention by acquisition cohort, device platform, and activation milestones before recommending rollback.”",
    vagueFollowUp: "“How would you distinguish whether the drop is caused by low-intent signup influx versus broken UX?”",
    starAnswer: "I would decompose the retention drop by segmenting the new signup cohort versus existing cohorts. First, I'd check if top-of-funnel marketing channels introduced lower-intent traffic. Second, I'd map the activation funnel to identify the exact step with the biggest drop-off (e.g., email verification vs profile setup). If existing users had stable retention and the drop was concentrated only in new cohorts, the issue is onboarding UX confusion, not core product value.",
    starScore: 96,
    starFlagged: "Crisp hypotheses. You may also mention statistical power calculations for the split-test.",
    starRewrite: "Structured diagnostic hierarchy from acquisition quality down to granular behavioral funnel steps.",
    starFollowUp: "“Spot on. Suppose the drop-off is concentrated entirely on iOS 17 devices. What’s your next hypothesis?”"
  },
  "HR & managerial rounds": {
    img: "/images/rehearse/interview/roles-executive-leadership.webp",
    question: "“Tell me about a time you strongly disagreed with a product manager's technical deadline. How did you handle the conflict?”",
    context: "Engineering Leadership & Stakeholder Alignment",
    level: "Staff / Engineering Manager",
    vagueAnswer: "The PM wanted to ship a feature way too fast. I told him it was impossible without cutting corners. We argued a bit in Slack, but eventually we just compromised and worked overtime to get it out.",
    vagueScore: 45,
    vagueFlagged: "“We argued a bit in Slack, but eventually worked overtime” — Conveys defensive friction and unsustainable burn.",
    vagueRewrite: "“I prepared a 2-option scope vs. reliability trade-off matrix and held a 1:1 meeting to align on customer risk.”",
    vagueFollowUp: "“Working overtime isn't sustainable risk mitigation. What systemic process change did you introduce afterward?”",
    starAnswer: "Our PM wanted to release real-time notifications ahead of an investor demo, which would have required bypassing automated integration tests. Rather than saying 'no', I scheduled a 30-minute sync with an impact trade-off matrix. I proposed Phase 1: shipping the core notification UI with polling for the demo, and Phase 2: shipping the WebSocket architecture the following sprint with full test coverage. The PM agreed, the demo succeeded, and zero regressions were introduced to production.",
    starScore: 95,
    starFlagged: "Superb demonstration of empathetic stakeholder communication and de-escalation.",
    starRewrite: "Replaced refusal with collaborative tradeoff options, protecting engineering rigor while meeting business milestones.",
    starFollowUp: "“How did you follow up with the PM afterward to ensure future sprint estimates included testing from day one?”"
  },
  "Internships & freshers": {
    img: "/images/rehearse/learning/roles-internships-freshers.webp",
    question: "“Walk me through your most challenging academic or personal coding project. What was the hardest bug you encountered?”",
    context: "Foundational Reasoning & Problem Solving",
    level: "University / Early Career",
    vagueAnswer: "I built a movie recommendation web app using React and Node.js. It had a bug where the database kept crashing when I searched for movies, but I searched on Stack Overflow and fixed it by restarting the server.",
    vagueScore: 50,
    vagueFlagged: "“fixed it by restarting the server” — Obscures root-cause triage and concurrency handling.",
    vagueRewrite: "“Identified an unhandled promise rejection in the search route that exhausted database connection pool connections.”",
    vagueFollowUp: "“Why did the server crash instead of catching the error? What was the underlying root cause?”",
    starAnswer: "For my final semester project, I built an asynchronous collaborative code editor using Node.js and WebSockets. The hardest issue was race conditions during simultaneous character insertions, which caused cursor desynchronization. After researching operational transformation, I implemented an open-source conflict-free replicated data type (CRDT) library and wrote unit tests for out-of-order packet arrival. This eliminated desync across 20 simulated concurrent users.",
    starScore: 92,
    starFlagged: "Terrific demonstration of curiosity, independent research, and self-directed rigor.",
    starRewrite: "Strong technical initiative demonstrating distributed state management and defensive testing practices.",
    starFollowUp: "“Great choice of CRDTs. What was the performance overhead compared to simple server-side locking?”"
  }
};

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  initialRole = "Software engineering"
}) => {
  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [candidateResponse, setCandidateResponse] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    clarity: number;
    depth: number;
    structure: number;
    flagged: string;
    rewrite: string;
    followUp: string;
  } | null>(null);

  useEffect(() => {
    if (initialRole && SCENARIOS[initialRole]) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    setCandidateResponse('');
    setFeedback(null);
    setIsEvaluating(false);
    setIsPlayingAudio(false);
  }, [selectedRole]);

  if (!isOpen) return null;

  const currentScenario = SCENARIOS[selectedRole] || SCENARIOS["Software engineering"];

  const handleSelectPreset = (type: 'vague' | 'star') => {
    if (type === 'vague') {
      setCandidateResponse(currentScenario.vagueAnswer);
    } else {
      setCandidateResponse(currentScenario.starAnswer);
    }
  };

  const handleEvaluate = () => {
    if (!candidateResponse.trim()) return;

    setIsEvaluating(true);
    setFeedback(null);

    setTimeout(() => {
      setIsEvaluating(false);
      const isStar = candidateResponse.length > 250 || candidateResponse.includes("latency") || candidateResponse.includes("decomposed") || candidateResponse.includes("matrix") || candidateResponse.includes("CRDT");

      const score = isStar ? currentScenario.starScore : currentScenario.vagueScore;
      const result = {
        score,
        clarity: isStar ? 96 : 58,
        depth: isStar ? 92 : 46,
        structure: isStar ? 94 : 52,
        flagged: isStar ? currentScenario.starFlagged : currentScenario.vagueFlagged,
        rewrite: isStar ? currentScenario.starRewrite : currentScenario.vagueRewrite,
        followUp: isStar ? currentScenario.starFollowUp : currentScenario.vagueFollowUp,
      };

      setFeedback(result);

      if (score > 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#b8542c', '#dfa84c', '#5b8076', '#f3e7c9']
        });
      }
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#1a0d08]/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Surface */}
      <div className="relative bg-[#fbf6ec] text-[#2a170f] max-w-4xl w-full rounded-3xl shadow-[0_30px_90px_rgba(26,13,8,0.45)] border border-[#3a2318]/25 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ================= Header Bar ================= */}
        <div className="px-6 sm:px-8 py-4 bg-[#23120a] text-[#f6ebd4] flex items-center justify-between border-b border-[#dfa84c]/20 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#b8542c] flex items-center justify-center text-[#f6ebd4] shadow-xs">
              <Sparkles className="w-4 h-4 text-[#dfa84c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl text-[#f6ebd4] leading-tight font-normal">
                  Rehearse Live Session Studio
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#dfa84c]/20 text-[#dfa84c] border border-[#dfa84c]/30">
                  Interactive Sandbox
                </span>
              </div>
              <p className="text-[12px] text-[#f6ebd4]/70 font-sans">
                Experience real-time AI follow-ups and sentence-level calibration.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-[#f6ebd4]/80 hover:text-[#f6ebd4] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= Role Track Selector ================= */}
        <div className="px-6 sm:px-8 pt-4 pb-3 bg-[#f5ecda] border-b border-[#3a2318]/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#8a4224] font-semibold">
              Select Calibration Track:
            </span>

            {/* Segmented Control */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {Object.keys(SCENARIOS).map((role) => {
                const isActive = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#23120a] text-[#f6ebd4] shadow-xs font-semibold'
                        : 'bg-[#e9dcbf] text-[#3a2318]/85 hover:bg-[#ded0b1] hover:text-[#23120a]'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= Scrollable Body ================= */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#fbf6ec]">
          
          {/* AI Interviewer Conversational Stage */}
          <div className="relative rounded-2xl bg-[#f4ead5] border border-[#3a2318]/15 p-5 sm:p-6 shadow-[0_4px_16px_rgba(58,35,24,0.03)]">
            
            {/* Context meta row */}
            <div className="flex items-center justify-between mb-3.5 border-b border-[#3a2318]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5b8076] animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#3a2318] font-semibold">
                  AI Interviewer • {currentScenario.context}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-[#8a4224] bg-[#ebd8b7] px-2 py-0.5 rounded-sm">
                  {currentScenario.level}
                </span>
              </div>

              {/* Simulated audio readout button */}
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#23120a] text-[#dfa84c]'
                    : 'bg-[#ebd8b7] text-[#3a2318] hover:bg-[#dfcaa8]'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3 h-3 text-[#dfa84c]" />
                    <span className="hidden sm:inline">Playing question...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3 h-3 text-[#b8542c]" />
                    <span>Listen</span>
                  </>
                )}
                <div className="flex items-center gap-0.5 h-2.5 pl-1">
                  {[40, 90, 60, 100, 50].map((h, i) => (
                    <span
                      key={i}
                      className={`w-[1.5px] rounded-full transition-all ${
                        isPlayingAudio ? 'bg-[#dfa84c] animate-pulse' : 'bg-[#3a2318]/30'
                      }`}
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </button>
            </div>

            {/* Stage content: Illustration + Spoken Question */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#3a2318]/20 bg-[#23120a] shadow-sm">
                <img
                  src={currentScenario.img}
                  alt={currentScenario.context}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <p className="font-serif text-lg sm:text-[21px] text-[#2a170f] leading-snug font-normal">
                {currentScenario.question}
              </p>
            </div>
          </div>

          {/* Candidate Response Workspace */}
          <div className="space-y-3">
            
            {/* Header row: Label + Preset Sample Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#8a4224] font-semibold flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#b8542c]" />
                Your Articulated Response:
              </label>

              {/* Try sample answer pills */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans text-[#3a2318]/70">Try sample:</span>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('vague')}
                  className="px-2.5 py-1 rounded-full bg-[#f4ead5] hover:bg-[#ebd8b7] text-[#8a4224] border border-[#3a2318]/15 text-[11px] font-sans transition-colors cursor-pointer"
                >
                  Weak / Vague
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('star')}
                  className="px-2.5 py-1 rounded-full bg-[#23120a] hover:bg-[#351d12] text-[#f6ebd4] text-[11px] font-sans transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="text-[#dfa84c]">★</span>
                  <span>Structured STAR</span>
                </button>
              </div>
            </div>

            {/* Response Textarea */}
            <div className="relative rounded-2xl overflow-hidden border border-[#3a2318]/25 bg-[#fdfbf7] focus-within:border-[#b8542c] focus-within:ring-2 focus-within:ring-[#b8542c]/20 shadow-inner transition-all">
              <textarea
                rows={4}
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                placeholder="Type your response here, or choose one of the sample answers above to test the calibration scoring engine..."
                className="w-full p-4 sm:p-5 bg-transparent text-[#2a170f] text-[14.5px] sm:text-[15px] focus:outline-none placeholder-[#3a2318]/40 leading-relaxed font-sans resize-y"
              />

              {/* Textarea Bottom Tools */}
              <div className="px-4 py-2.5 bg-[#f6ebd4]/50 border-t border-[#3a2318]/10 flex items-center justify-between text-xs font-mono text-[#3a2318]/60">
                <div className="flex items-center gap-3">
                  <span>{candidateResponse.trim().split(/\s+/).filter(Boolean).length} words</span>
                  {candidateResponse && (
                    <button
                      type="button"
                      onClick={() => setCandidateResponse('')}
                      className="text-[#8a4224] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                <span className="text-[11px]">Real-time evaluation model</span>
              </div>
            </div>

            {/* Evaluate Submit Action */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating || !candidateResponse.trim()}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#b8542c] hover:bg-[#a04520] active:scale-[0.98] text-[#fdfaf3] disabled:opacity-45 disabled:pointer-events-none transition-all text-[13.5px] font-medium tracking-wide shadow-md hover:shadow-lg cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#dfa84c]" />
                    <span>Scoring articulation &amp; depth...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Score Answer</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= Feedback / Debrief Output ================= */}
          {feedback && (
            <div className="rounded-2xl bg-[#23120a] text-[#f6ebd4] border border-[#dfa84c]/25 p-6 sm:p-7 shadow-xl animate-in slide-in-from-bottom-2 duration-300 space-y-5">
              
              {/* Scorecard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dfa84c]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#dfa84c] font-semibold">
                      Real-Time Interview Debrief
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                      feedback.score >= 80 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' 
                        : 'bg-[#9c3a1a]/40 text-[#dfa84c] border border-[#9c3a1a]'
                    }`}>
                      {feedback.score >= 80 ? 'Calibrated: Strong Hire' : 'Needs STAR Refinement'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif text-5xl sm:text-6xl font-normal text-white">
                      {feedback.score}
                    </span>
                    <span className="text-sm text-[#f6ebd4]/70 font-mono">
                      / 100 overall score
                    </span>
                  </div>
                </div>

                {/* Micro Benchmark Metrics */}
                <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="bg-[#2d180f] px-3.5 py-2 rounded-xl border border-[#dfa84c]/15 text-center">
                    <div className="text-[10px] uppercase text-[#f6ebd4]/60">Clarity</div>
                    <div className="text-base font-semibold text-[#dfa84c]">{feedback.clarity}%</div>
                  </div>
                  <div className="bg-[#2d180f] px-3.5 py-2 rounded-xl border border-[#dfa84c]/15 text-center">
                    <div className="text-[10px] uppercase text-[#f6ebd4]/60">Technical Depth</div>
                    <div className="text-base font-semibold text-emerald-400">{feedback.depth}%</div>
                  </div>
                  <div className="bg-[#2d180f] px-3.5 py-2 rounded-xl border border-[#dfa84c]/15 text-center">
                    <div className="text-[10px] uppercase text-[#f6ebd4]/60">Structure</div>
                    <div className="text-base font-semibold text-[#f6ebd4]">{feedback.structure}%</div>
                  </div>
                </div>
              </div>

              {/* Editorial Critiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Flagged sentence */}
                <div className="p-4 rounded-xl bg-[#2d180f]/90 border border-[#dfa84c]/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-semibold mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Sentence Diagnostic</span>
                    </div>
                    <p className="text-[13.5px] text-[#f6ebd4]/90 italic leading-relaxed">
                      {feedback.flagged}
                    </p>
                  </div>
                </div>

                {/* Calibration Advice */}
                <div className="p-4 rounded-xl bg-[#2d180f]/90 border border-[#dfa84c]/15 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-semibold mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Calibration Advice</span>
                    </div>
                    <p className="text-[13.5px] text-[#f6ebd4]/90 leading-relaxed">
                      {feedback.rewrite}
                    </p>
                  </div>
                </div>
              </div>

              {/* Immediate Follow-Up Question */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#b8542c]/25 border border-[#b8542c]/50">
                <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#dfa84c] font-semibold mb-1.5">
                  Interviewer's Live Follow-Up Probe:
                </div>
                <p className="font-serif italic text-[17px] sm:text-[18px] text-white leading-snug">
                  {feedback.followUp}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* ================= Modal Footer ================= */}
        <div className="px-6 sm:px-8 py-3.5 bg-[#f5ecda] border-t border-[#3a2318]/15 flex items-center justify-between text-xs text-[#3a2318]/80 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Zero data retention • Calibrated to industry rubrics</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 rounded-full border border-[#3a2318]/25 hover:bg-[#23120a] hover:text-[#f6ebd4] transition-colors text-xs font-medium cursor-pointer"
          >
            Close simulation
          </button>
        </div>

      </div>
    </div>
  );
};