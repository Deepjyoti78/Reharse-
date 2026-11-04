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
  Volume2,
  Sparkles,
  Clock,
  Code2,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useInterview } from '../../context/InterviewContext';
import { playElevenLabsSpeech, stopElevenLabsSpeech } from '../../services/elevenlabs';

export const Stage9Report: React.FC = () => {
  const { 
    activeReport, 
    restartWithSameConfig, 
    exitToDashboard, 
    setCurrentView,
    stopAllMediaHardware
  } = useInterview();

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    activeReport?.questionEvaluations[0]?.questionId || null
  );
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [isPlayingAudioAnswer, setIsPlayingAudioAnswer] = useState<string | null>(null);

  // Guarantee webcam and mic hardware are 100% closed upon reaching report
  React.useEffect(() => {
    stopAllMediaHardware();
    stopElevenLabsSpeech();
  }, [stopAllMediaHardware]);

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
      <div className="max-w-md mx-auto p-8 text-center bg-[#faf0d8] border border-[#3a2318]/15 rounded-3xl shadow-sm">
        <p className="text-sm text-[#3a2318]/70">No evaluation report available. Please complete an interview first.</p>
        <button
          onClick={exitToDashboard}
          className="mt-4 px-5 py-2.5 rounded-full bg-[#b4532a] text-white text-xs font-medium cursor-pointer"
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
      stopElevenLabsSpeech();
      setIsPlayingAudioAnswer(null);
      return;
    }
    setIsPlayingAudioAnswer(qId);
    
    playElevenLabsSpeech({
      text: answer,
      onEnded: () => setIsPlayingAudioAnswer(null),
      onError: () => setIsPlayingAudioAnswer(null),
    });
  };

  // Score tier color mapping
  const isHighTier = activeReport.overallScore >= 75;
  const isMidTier = activeReport.overallScore >= 50 && activeReport.overallScore < 75;
  const scoreColor = isHighTier ? '#5b8076' : isMidTier ? '#dfa84c' : '#b4532a';
  const scoreBg = isHighTier ? 'rgba(91, 128, 118, 0.12)' : isMidTier ? 'rgba(223, 168, 76, 0.12)' : 'rgba(180, 83, 42, 0.12)';

  // Circular progress calculation (radius 48, circumference ~301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeReport.overallScore / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto font-sans print:p-0 print:max-w-none animate-fade-in">
      
      {/* Top Header & Navigation Actions Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 print:hidden">
        <button
          onClick={exitToDashboard}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#f0e4c8] hover:bg-[#e6d8ba] text-[#2a170f] text-xs sm:text-[13px] font-medium font-sans border border-[#3a2318]/15 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFullTranscript(!showFullTranscript)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f0e4c8] hover:bg-[#e6d8ba] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/15 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#5b8076]" />
            <span>{showFullTranscript ? 'Hide Transcript' : 'Full Transcript'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f0e4c8] hover:bg-[#e6d8ba] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/15 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#b4532a]" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={restartWithSameConfig}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium font-sans transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* FULL CONVERSATION TRANSCRIPT DRAWER */}
      {showFullTranscript && (
        <div className="mb-8 rounded-3xl bg-[#faf0d8] border border-[#3a2318]/20 p-5 sm:p-7 shadow-md animate-in fade-in duration-200 print:hidden">
          <div className="flex items-center justify-between border-b border-[#3a2318]/12 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#b4532a]" />
              <h3 className="font-serif text-xl sm:text-2xl text-[#2a170f]">Full Conversation Transcript</h3>
            </div>
            <span className="text-xs font-mono text-[#3a2318]/65 bg-[#3a2318]/8 px-2.5 py-1 rounded-full">
              {activeReport.transcript.length} turns recorded
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
            {activeReport.transcript.map((t, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  t.speaker === 'ai' 
                    ? 'bg-[#f4e8cc] border-[#3a2318]/15 text-[#2a170f]' 
                    : 'bg-[#fbf5e6] border-[#3a2318]/15 text-[#2a170f] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-[10.5px] font-mono text-[#3a2318]/60 mb-1.5">
                  <span className="font-bold uppercase tracking-wider text-[#b4532a]">
                    {t.speaker === 'ai' ? activeReport.interviewerName : 'You (Candidate)'}
                  </span>
                  <span>{t.timestamp}</span>
                </div>
                <p className="font-sans leading-relaxed text-xs sm:text-[13px]">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION A: Overall Performance Hero Scorecard */}
      <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 sm:p-8 shadow-md mb-8 relative overflow-hidden transition-shadow hover:shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left: Circular SVG Score Ring Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#f5e7c8]/70 border border-[#3a2318]/12 text-center shadow-xs">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#b4532a] font-semibold mb-2">
              Overall Benchmark Score
            </span>

            {/* Circular Gauge Graphic */}
            <div className="relative w-32 h-32 flex items-center justify-center my-1">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring Track */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-[#3a2318]/15 fill-transparent"
                  strokeWidth="8"
                />
                {/* Dynamic Value Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="fill-transparent transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Number centered inside Ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="font-serif text-4xl sm:text-[42px] font-normal text-[#2a170f]">
                  {activeReport.overallScore}
                </span>
                <span className="text-[11px] font-mono text-[#3a2318]/50 mt-0.5">/ 100</span>
              </div>
            </div>

            {/* Status Pill */}
            <div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium font-sans mt-2 shadow-2xs border"
              style={{ backgroundColor: scoreBg, borderColor: `${scoreColor}30`, color: scoreColor }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{activeReport.performanceLabel}</span>
            </div>
          </div>

          {/* Right: Session Metadata & Executive Summary */}
          <div className="md:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#b4532a]/10 text-[#b4532a] text-[10.5px] font-mono uppercase tracking-wider border border-[#b4532a]/20">
                  <Sparkles className="w-3 h-3" />
                  Official Debrief
                </span>
                <span className="text-[11px] font-mono text-[#3a2318]/60">
                  {activeReport.createdAt}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight mb-2">
                {activeReport.jobRole} Evaluation
              </h1>

              <p className="text-xs sm:text-[13.5px] text-[#3a2318]/80 leading-relaxed font-sans mb-4">
                Session evaluated by <strong className="text-[#2a170f] font-semibold">{activeReport.interviewerName}</strong> across {activeReport.questionsAnswered} primary questions and adaptive follow-ups in a {activeReport.difficulty.toLowerCase()} setting.
              </p>
            </div>

            {/* 4 Metadata Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-[#3a2318]/12 text-xs font-sans">
              <div className="p-3 rounded-2xl bg-[#f2e5cb] border border-[#3a2318]/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#3a2318]/60 flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-[#b4532a]" />
                  <span>Track</span>
                </span>
                <span className="font-medium text-[#2a170f] text-xs sm:text-[13px] capitalize mt-1">
                  {activeReport.interviewType}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#f2e5cb] border border-[#3a2318]/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#3a2318]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#5b8076]" />
                  <span>Duration</span>
                </span>
                <span className="font-medium text-[#2a170f] text-xs sm:text-[13px] mt-1">
                  {activeReport.durationMinutes} Minutes
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#f2e5cb] border border-[#3a2318]/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#3a2318]/60 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#dfa84c]" />
                  <span>Difficulty</span>
                </span>
                <span className="font-medium text-[#b4532a] text-xs sm:text-[13px] mt-1">
                  {activeReport.difficulty}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#f2e5cb] border border-[#3a2318]/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-[#3a2318]/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#5b8076]" />
                  <span>Questions</span>
                </span>
                <span className="font-medium text-[#2a170f] text-xs sm:text-[13px] mt-1">
                  {activeReport.questionsAnswered} Answered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Competency Breakdown with Styled Progress Indicators */}
      <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 sm:p-8 shadow-md mb-8 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-[#b4532a]" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2a170f]">Competency Breakdown</h2>
        </div>
        <p className="text-xs sm:text-[13px] text-[#3a2318]/75 font-sans mb-6">
          Weighted evaluation scores across each critical dimension required for this role:
        </p>

        <div className="space-y-4">
          {activeReport.skillsBreakdown.map((skill, idx) => {
            const isSkillHigh = skill.score >= 80;
            const isSkillMid = skill.score >= 60 && skill.score < 80;
            const barColor = isSkillHigh ? '#5b8076' : isSkillMid ? '#dfa84c' : '#b4532a';
            const badgeBg = isSkillHigh ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300' : isSkillMid ? 'bg-amber-100/80 text-amber-900 border-amber-300' : 'bg-red-100/80 text-red-900 border-red-300';

            return (
              <div 
                key={idx} 
                className="p-4 sm:p-5 rounded-2xl bg-[#f5e7c8]/85 border border-[#3a2318]/12 shadow-2xs hover:bg-[#f3e5c4] transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base sm:text-lg text-[#2a170f] font-normal">{skill.name}</span>
                    <span className="text-[11px] font-mono text-[#3a2318]/60 bg-[#3a2318]/8 px-2 py-0.5 rounded-md">
                      {skill.weight}% weight
                    </span>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${badgeBg}`}>
                    {skill.score}%
                  </span>
                </div>

                {/* Styled Smooth Progress Bar */}
                <div className="w-full bg-[#3a2318]/15 rounded-full h-3 overflow-hidden mb-2.5 p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                    style={{
                      width: `${Math.max(5, skill.score)}%`,
                      backgroundColor: barColor
                    }}
                  />
                </div>

                {/* Qualitative Diagnosis Note */}
                <p className="text-xs sm:text-[13px] text-[#3a2318]/80 font-sans leading-relaxed">
                  {skill.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION C: Question-by-Question Deep Dive with Accordions */}
      <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 sm:p-8 shadow-md mb-8 transition-shadow hover:shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#b4532a]" />
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2a170f]">Question-by-Question Deep Dive</h2>
          </div>
          <span className="text-xs font-mono text-[#3a2318]/65 bg-[#3a2318]/8 px-3 py-1 rounded-full">
            {activeReport.questionEvaluations.length} Questions Graded
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-[#3a2318]/75 font-sans mb-6">
          Detailed analysis of each response, highlighting what impressed the interviewer, missing concepts, and a calibrated model answer.
        </p>

        <div className="space-y-4">
          {activeReport.questionEvaluations.map((q) => {
            const isExpanded = expandedQuestionId === q.questionId;
            const qScoreColor = q.score >= 8 ? '#5b8076' : q.score >= 6 ? '#dfa84c' : '#b4532a';

            return (
              <div
                key={q.questionId}
                className="rounded-2xl border border-[#3a2318]/15 bg-[#f5e7c8] overflow-hidden shadow-2xs transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.questionId)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#eee0be] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-[#2a170f] text-[#fdfaf3] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 shadow-2xs">
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
                      <span className="font-serif text-lg font-bold" style={{ color: qScoreColor }}>{q.score}</span>
                      <span className="text-[10px] text-[#3a2318]/50 font-mono"> / 10</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#3a2318]/60" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#3a2318]/60" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-[#3a2318]/12 bg-[#faf0d8] space-y-5 animate-in fade-in duration-150">
                    
                    {/* Candidate's submitted response */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#3a2318]/70 mb-2">
                        <span>Your Submitted Answer</span>
                        <button
                          type="button"
                          onClick={() => handlePlayAudioAnswer(q.questionId, q.submittedAnswer)}
                          className="text-[#b4532a] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isPlayingAudioAnswer === q.questionId ? 'Playing...' : 'Listen to Response'}</span>
                        </button>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#f2e5cb] border border-[#3a2318]/15 text-xs sm:text-sm text-[#2a170f] font-sans leading-relaxed">
                        "{q.submittedAnswer}"
                      </div>
                    </div>

                    {/* Strengths & Improvements 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300">
                        <div className="text-[11px] font-mono uppercase text-emerald-900 font-bold mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Key Strengths Identified</span>
                        </div>
                        <ul className="space-y-1.5 text-emerald-950">
                          {q.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold">•</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300">
                        <div className="text-[11px] font-mono uppercase text-amber-900 font-bold mb-2 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Areas for Improvement</span>
                        </div>
                        <ul className="space-y-1.5 text-amber-950">
                          {q.improvements.map((imp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-amber-700 font-bold">•</span>
                              <span>{imp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Ideal Model Benchmark Response */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#b4532a] mb-2 font-semibold">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Ideal Model Benchmark Response (STAR Calibrated)</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#f5e7c8] border border-[#b4532a]/30 text-xs sm:text-[13px] text-[#2a170f] font-sans leading-relaxed italic">
                        "{q.suggestedAnswer}"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION D: Demonstrated Strengths vs Priority Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Strengths */}
        <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <h3 className="font-serif text-2xl text-[#2a170f]">Demonstrated Strengths</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#3a2318]/90 font-sans">
            {activeReport.topStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-[#f5e7c8]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Polish */}
        <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#b4532a]" />
            <h3 className="font-serif text-2xl text-[#2a170f]">Priority Areas to Polish</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#3a2318]/90 font-sans">
            {activeReport.keyAreasToImprove.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-[#f5e7c8]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b4532a] mt-2 shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION E: Personalized Next Steps Roadmap */}
      <div className="rounded-3xl bg-[#faf0d8] border border-[#3a2318]/18 p-6 sm:p-8 shadow-md mb-8 transition-shadow hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-[#b4532a]" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2a170f]">Your Next Steps — Learning Roadmap</h2>
        </div>
        <p className="text-xs sm:text-[13px] text-[#3a2318]/75 font-sans mb-6">
          Curated practice drills and revision milestones to turn identified gaps into clear strengths before your live interview:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeReport.nextStepsRoadmap.map((step, idx) => (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#f5e7c8] border border-[#3a2318]/12 flex flex-col justify-between shadow-2xs hover:bg-[#f3e5c4] transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                    step.priority === 'High' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {step.priority} Priority
                  </span>
                  <span className="text-[11px] font-mono text-[#3a2318]/60 capitalize">{step.category}</span>
                </div>
                <h4 className="font-serif text-lg text-[#2a170f] leading-snug mb-1">
                  {step.topic}
                </h4>
                <p className="text-xs text-[#3a2318]/80 font-sans mb-3 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#3a2318]/10 text-xs text-[#b4532a] font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Action: </span>
                <span className="text-[#2a170f] font-normal">{step.actionableExercise}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION F: Final Actions Footer (Hidden in print) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#2a170f] text-[#f8eed8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl print:hidden">
        <div>
          <div className="font-serif text-2xl text-[#f6ebd4]">Ready for another rehearsal?</div>
          <div className="text-xs text-[#f8eed8]/70 mt-1 font-sans">
            Target your identified growth areas in an adaptive follow-up session.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('weak-areas')}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#f0e4c8] hover:bg-[#e6d8ba] text-[#2a170f] text-xs font-medium font-sans transition-all cursor-pointer text-center"
          >
            Practice Weak Areas
          </button>

          <button
            onClick={restartWithSameConfig}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-white text-xs font-medium font-sans transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
