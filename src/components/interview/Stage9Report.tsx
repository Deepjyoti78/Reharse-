import React, { useState } from 'react';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  Volume2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useInterview } from '../../context/InterviewContext';

export const Stage9Report: React.FC = () => {
  const { 
    activeReport, 
    restartWithSameConfig, 
    exitToDashboard, 
    setCurrentView 
  } = useInterview();

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    activeReport?.questionEvaluations[0]?.questionId || null
  );
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [isPlayingAudioAnswer, setIsPlayingAudioAnswer] = useState<string | null>(null);

  // Trigger celebration confetti on high score mount
  React.useEffect(() => {
    if (activeReport && activeReport.overallScore >= 75) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#b4532a', '#dfa84c', '#5b8076']
        });
      } catch {
        // ignore
      }
    }
  }, [activeReport]);

  if (!activeReport) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <p className="text-sm text-[#3a2318]/70">No report available. Please run an interview first.</p>
        <button
          onClick={exitToDashboard}
          className="mt-4 px-4 py-2 rounded-full bg-[#b4532a] text-white text-xs font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePrintPdf = () => {
    window.print();
  };

  const handlePlayAudioAnswer = (qId: string, answer: string) => {
    if (isPlayingAudioAnswer === qId) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlayingAudioAnswer(null);
      return;
    }
    setIsPlayingAudioAnswer(qId);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(answer);
      u.rate = 1.0;
      u.onend = () => setIsPlayingAudioAnswer(null);
      u.onerror = () => setIsPlayingAudioAnswer(null);
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => setIsPlayingAudioAnswer(null), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 font-sans print:p-0 print:max-w-none animate-fade-in-up">
      
      {/* Top Header & Actions Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 print:hidden">
        <button
          onClick={exitToDashboard}
          className="inline-flex items-center gap-1.5 text-xs text-[#3a2318]/70 hover:text-[#3a2318] font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFullTranscript(!showFullTranscript)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f] text-xs font-medium transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showFullTranscript ? 'Hide Transcript' : 'Full Transcript'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f] text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={restartWithSameConfig}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* FULL TRANSCRIPT DRAWER */}
      {showFullTranscript && (
        <div className="mb-8 rounded-2xl bg-[#faf5e8] border border-[#3a2318]/20 p-6 shadow-sm animate-in fade-in duration-200 print:hidden">
          <div className="flex items-center justify-between border-b border-[#3a2318]/10 pb-3 mb-4">
            <h3 className="font-serif text-xl text-[#2a170f]">Full Conversation Transcript</h3>
            <span className="text-xs font-mono text-[#3a2318]/60">
              {activeReport.transcript.length} turns recorded
            </span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 text-xs">
            {activeReport.transcript.map((t, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl ${
                  t.speaker === 'ai' ? 'bg-[#f0e2c5] text-[#2a170f]' : 'bg-white border border-[#3a2318]/15 text-[#2a170f]'
                }`}
              >
                <div className="flex items-center justify-between text-[10.5px] font-mono text-[#3a2318]/60 mb-1">
                  <span className="font-bold uppercase">{t.speaker === 'ai' ? activeReport.interviewerName : 'You (Candidate)'}</span>
                  <span>{t.timestamp}</span>
                </div>
                <p className="font-sans leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION A: Overall Performance Hero Scorecard */}
      <div className="rounded-3xl bg-[#faf3e3] border border-[#3a2318]/20 p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        
        {/* Editorial Watermark */}
        <div className="absolute top-2 right-4 text-[70px] sm:text-[100px] font-serif text-[#3a2318]/5 select-none pointer-events-none leading-none">
          Rehearse
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left score ring / gauge with Animated Entrance */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#f5e9d0]/70 border border-[#3a2318]/10 text-center animate-scale-in">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#b4532a] mb-1">
              Overall Benchmark Score
            </span>
            <div className="font-serif text-6xl sm:text-7xl text-[#2a170f] font-normal leading-none my-2 transition-transform hover:scale-105">
              {activeReport.overallScore}
              <span className="text-2xl text-[#3a2318]/40 font-sans font-light">/100</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4532a] text-[#fdfaf3] text-xs font-medium font-sans mt-2 shadow-xs animate-subtle-float">
              <Award className="w-3.5 h-3.5" />
              <span>{activeReport.performanceLabel}</span>
            </div>
          </div>

          {/* Right session metadata & summary */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#3a2318]/10 text-[#3a2318] text-[11px] font-mono uppercase tracking-wider mb-2">
                <span>Official Debrief</span>
                <span>•</span>
                <span>{activeReport.createdAt}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight mb-2">
                {activeReport.jobRole} Evaluation
              </h1>
              <p className="text-xs sm:text-sm text-[#3a2318]/80 leading-relaxed font-sans mb-4">
                Session evaluated by <strong>{activeReport.interviewerName}</strong> across {activeReport.questionsAnswered} primary questions and adaptive follow-ups in a {activeReport.difficulty.toLowerCase()} setting.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-[#3a2318]/15 text-xs font-sans">
              <div className="p-2.5 rounded-xl bg-[#f0e3c5]/60">
                <span className="block text-[10px] font-mono uppercase text-[#3a2318]/60">Track</span>
                <span className="font-medium text-[#2a170f] capitalize">{activeReport.interviewType}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f0e3c5]/60">
                <span className="block text-[10px] font-mono uppercase text-[#3a2318]/60">Duration</span>
                <span className="font-medium text-[#2a170f]">{activeReport.durationMinutes} Minutes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f0e3c5]/60">
                <span className="block text-[10px] font-mono uppercase text-[#3a2318]/60">Difficulty</span>
                <span className="font-medium text-[#b4532a]">{activeReport.difficulty}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f0e3c5]/60">
                <span className="block text-[10px] font-mono uppercase text-[#3a2318]/60">Questions</span>
                <span className="font-medium text-[#2a170f]">{activeReport.questionsAnswered} Answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Skill-wise Breakdown Bars */}
      <div className="rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#b4532a]" />
          <h2 className="font-serif text-2xl text-[#2a170f]">Competency Breakdown</h2>
        </div>
        <p className="text-xs text-[#3a2318]/75 font-sans mb-6">
          Weighted evaluation scores across each critical dimension required for this role:
        </p>

        <div className="space-y-4">
          {activeReport.skillsBreakdown.map((skill, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#f7eed9] border border-[#3a2318]/10">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div>
                  <span className="font-serif text-base text-[#2a170f] font-normal">{skill.name}</span>
                  <span className="text-[11px] font-mono text-[#3a2318]/50 ml-2">({skill.weight}% weight)</span>
                </div>
                <span className="font-mono font-bold text-sm text-[#2a170f]">{skill.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#3a2318]/10 rounded-full h-2.5 overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${skill.score}%`,
                    backgroundColor: skill.score >= 88 ? '#5b8076' : skill.score >= 75 ? '#dfa84c' : '#b4532a'
                  }}
                />
              </div>

              <p className="text-[11.5px] text-[#3a2318]/80 font-sans leading-snug">
                {skill.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION C: Question-by-Question Evaluation Cards */}
      <div className="rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#b4532a]" />
            <h2 className="font-serif text-2xl text-[#2a170f]">Question-by-Question Deep Dive</h2>
          </div>
          <span className="text-xs font-mono text-[#3a2318]/60">
            {activeReport.questionEvaluations.length} Questions Graded
          </span>
        </div>
        <p className="text-xs text-[#3a2318]/75 font-sans mb-6">
          Detailed analysis of each response, highlighting what impressed the interviewer, missing concepts, and a calibrated model answer.
        </p>

        <div className="space-y-4">
          {activeReport.questionEvaluations.map((q) => {
            const isExpanded = expandedQuestionId === q.questionId;

            return (
              <div
                key={q.questionId}
                className="rounded-2xl border border-[#3a2318]/20 bg-[#faf3e3] overflow-hidden shadow-xs transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.questionId)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f7eed9] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#b4532a] text-[#fdfaf3] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      Q{q.questionNumber}
                    </span>
                    <div className="min-w-0">
                      <div className="font-serif text-base sm:text-lg text-[#2a170f] leading-snug font-normal line-clamp-1">
                        {q.originalQuestion}
                      </div>
                      <div className="text-[11px] font-mono text-[#3a2318]/60 mt-0.5">
                        {q.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-serif text-lg font-bold text-[#2a170f]">{q.score}</span>
                      <span className="text-[10px] text-[#3a2318]/50 font-mono">/10</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#3a2318]/60" /> : <ChevronDown className="w-4 h-4 text-[#3a2318]/60" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-[#3a2318]/10 bg-white/70 space-y-5 animate-in fade-in duration-150">
                    
                    {/* Candidate's submitted response */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#3a2318]/70 mb-1.5">
                        <span>Your Submitted Answer</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudioAnswer(q.questionId, q.submittedAnswer)}
                          className="text-[#b4532a] hover:underline flex items-center gap-1 font-medium"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isPlayingAudioAnswer === q.questionId ? 'Playing...' : 'Listen to Response'}</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#faf5e8] border border-[#3a2318]/15 text-xs text-[#2a170f] font-sans leading-relaxed">
                        "{q.submittedAnswer}"
                      </div>
                    </div>

                    {/* Strengths & Improvements 2-Col Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                        <div className="text-[11px] font-mono uppercase text-emerald-900 font-bold mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Key Strengths Identified</span>
                        </div>
                        <ul className="space-y-1 text-emerald-950">
                          {q.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-700">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                        <div className="text-[11px] font-mono uppercase text-amber-900 font-bold mb-2 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Areas for Improvement</span>
                        </div>
                        <ul className="space-y-1 text-amber-950">
                          {q.improvements.map((imp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-700">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-3.5 rounded-xl bg-[#f0e3c5]/50 border border-[#3a2318]/15 text-xs">
                      <div className="font-semibold text-[#2a170f] mb-1 font-serif text-sm">
                        AI Evaluator Commentary:
                      </div>
                      <p className="text-[#3a2318]/90 font-sans leading-relaxed">
                        {q.aiFeedback}
                      </p>
                    </div>

                    {/* Suggested Exemplary Answer */}
                    <div className="p-4 rounded-xl bg-[#341d13] text-[#fbf7ee] text-xs">
                      <div className="flex items-center gap-1.5 font-serif text-sm text-[#dfa84c] mb-1.5">
                        <Lightbulb className="w-4 h-4 text-[#dfa84c]" />
                        <span>Recommended Model Answer (FAANG Calibrated)</span>
                      </div>
                      <p className="text-[#f8eed8]/90 font-sans leading-relaxed italic">
                        "{q.suggestedAnswer}"
                      </p>
                    </div>

                    {/* Follow-up pushback evaluation if exists */}
                    {q.followUpExchange && (
                      <div className="p-3.5 rounded-xl bg-[#fdfaf3] border border-[#3a2318]/15 text-xs">
                        <div className="text-[11px] font-mono text-[#b4532a] uppercase font-bold mb-1">
                          Adaptive Follow-up Exchange
                        </div>
                        <div className="font-medium text-[#2a170f] mb-1">
                          Interviewer: "{q.followUpExchange.question}"
                        </div>
                        <div className="text-[#3a2318]/80 mb-2">
                          Candidate: "{q.followUpExchange.answer}"
                        </div>
                        <div className="text-[11px] text-emerald-800 font-mono">
                          ✓ {q.followUpExchange.evaluation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION D: Strengths vs Areas to Improve Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Strengths */}
        <div className="rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif text-2xl text-[#2a170f]">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-[#3a2318]/90 font-sans">
            {activeReport.topStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#b4532a]" />
            <h3 className="font-serif text-2xl text-[#2a170f]">Priority Areas to Polish</h3>
          </div>
          <ul className="space-y-2.5 text-xs text-[#3a2318]/90 font-sans">
            {activeReport.keyAreasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b4532a] mt-1.5 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION E: Personalised Next Steps Roadmap */}
      <div className="rounded-3xl bg-[#faf3e3] border border-[#3a2318]/15 p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-[#b4532a]" />
          <h2 className="font-serif text-2xl text-[#2a170f]">Your Next Steps — Learning Roadmap</h2>
        </div>
        <p className="text-xs text-[#3a2318]/75 font-sans mb-6">
          Curated practice drills and revision milestones to turn these identified gaps into clear strengths before your live interview.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeReport.nextStepsRoadmap.map((step, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#faf7ee] border border-[#3a2318]/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    step.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {step.priority} Priority
                  </span>
                  <span className="text-[11px] font-mono text-[#3a2318]/50 capitalize">{step.category}</span>
                </div>
                <h4 className="font-serif text-lg text-[#2a170f] leading-snug mb-1">
                  {step.topic}
                </h4>
                <p className="text-xs text-[#3a2318]/80 font-sans mb-3">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#3a2318]/10 text-[11px] text-[#b4532a] font-medium flex items-center gap-1">
                <span>Action: </span>
                <span className="text-[#2a170f] font-normal">{step.actionableExercise}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: Final Actions Footer (Hidden in print) */}
      <div className="p-6 rounded-3xl bg-[#3a2318] text-[#f8eed8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg print:hidden">
        <div>
          <div className="font-serif text-2xl">Ready for another rehearsal?</div>
          <div className="text-xs text-[#f8eed8]/70 mt-0.5">
            Target your identified growth areas in an adaptive follow-up session.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('weak-areas')}
            className="px-5 py-2.5 rounded-full bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f] text-xs font-medium transition-all cursor-pointer"
          >
            Practice Weak Areas
          </button>

          <button
            onClick={restartWithSameConfig}
            className="px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-white text-xs font-medium transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
