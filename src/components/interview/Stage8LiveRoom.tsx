import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  Pause, 
  Play, 
  StopCircle, 
  RotateCcw, 
  Subtitles, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ShieldCheck 
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { getQuestionsForConfig } from '../../data/interviewBank';
import type { QuestionItem, UserTurn } from '../../types/interview';

export const Stage8LiveRoom: React.FC = () => {
  const { 
    config, 
    selectedInterviewer, 
    deviceState, 
    addTurn, 
    finishInterview, 
    exitToDashboard 
  } = useInterview();

  // Load question bank for this session
  const [questions] = useState<QuestionItem[]>(() => getQuestionsForConfig(config));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const activeQuestion = questions[currentQuestionIndex] || questions[0];

  // Conversation & AI States
  // 'ai-speaking' | 'listening' | 'user-speaking' | 'processing-followup' | 'ai-followup-speaking'
  const [aiState, setAiState] = useState<'ai-speaking' | 'listening' | 'user-speaking' | 'processing' | 'followup-ready'>('ai-speaking');
  
  // Follow-up interaction tracking
  const [hasAskedFollowUp, setHasAskedFollowUp] = useState(false);
  const [activeFollowUpText, setActiveFollowUpText] = useState<string | null>(null);

  // User input
  const [userAnswerText, setUserAnswerText] = useState('');
  const [userFollowUpAnswerText, setUserFollowUpAnswerText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(deviceState.cameraEnabled);
  const [showCaptions, setShowCaptions] = useState(true);

  // Modals
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Timers
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Video / Audio refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!isPauseModalOpen && !isEndModalOpen) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPauseModalOpen, isEndModalOpen]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Setup candidate webcam stream
  useEffect(() => {
    const startWebcam = async () => {
      if (!isCameraActive) return;
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
            audio: false
          });
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
        }
      } catch (e) {
        console.warn('Webcam feed fallback:', e);
      }
    };

    if (isCameraActive) {
      startWebcam();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraActive]);

  // Speak AI question
  const speakText = (text: string, onDone?: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = selectedInterviewer.speakingPace || 1.0;
      utterance.pitch = selectedInterviewer.voiceGender === 'female' ? 1.15 : 0.95;

      utterance.onend = () => {
        if (onDone) onDone();
      };
      utterance.onerror = () => {
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (onDone) onDone();
      }, 3500);
    }
  };

  // When question changes, speak question
  useEffect(() => {
    setAiState('ai-speaking');
    setHasAskedFollowUp(false);
    setActiveFollowUpText(null);
    setUserAnswerText('');
    setUserFollowUpAnswerText('');

    speakText(activeQuestion.question, () => {
      setAiState('listening');
    });

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionIndex]);

  // Handle Repeat Question
  const handleRepeatQuestion = () => {
    const textToSpeak = hasAskedFollowUp && activeFollowUpText ? activeFollowUpText : activeQuestion.question;
    setAiState('ai-speaking');
    speakText(textToSpeak, () => {
      setAiState('listening');
    });
  };

  // Handle Submit Answer
  const handleSubmitPrimaryAnswer = () => {
    if (!userAnswerText.trim()) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Trigger AI Follow-up probing
    setAiState('processing');

    setTimeout(() => {
      const followUp = activeQuestion.sampleFollowUp || 
        `Interesting point. Can you drill into the failure modes of that approach if throughput suddenly scales 10x?`;
      
      setActiveFollowUpText(followUp);
      setHasAskedFollowUp(true);
      setAiState('ai-speaking');

      speakText(followUp, () => {
        setAiState('listening');
      });
    }, 1200);
  };

  // Handle Submit Follow-up & Move to next question or end
  const handleCompleteQuestion = () => {
    const turnData: UserTurn = {
      questionId: activeQuestion.id,
      questionText: activeQuestion.question,
      userAnswerText: userAnswerText.trim(),
      audioDurationSeconds: Math.floor(elapsedSeconds / (currentQuestionIndex + 1)),
      answeredAt: new Date().toLocaleTimeString(),
      followUpText: activeFollowUpText || undefined,
      userFollowUpAnswerText: userFollowUpAnswerText.trim() || undefined
    };

    addTurn(turnData);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Reached end of questions
      finishInterview();
    }
  };

  // Sample answer loaders for instant test demonstration
  const handleLoadSampleStarAnswer = () => {
    const sample = `In my previous role scaling our checkout API, we encountered erratic latency spikes where the main database connection pool was exhausted. My task was to isolate the bottleneck without degrading the user cart experience. I implemented a Redis cache-aside proxy with probabilistic early expiration (XFetch algorithm) and wrapped slow read operations in circuit breakers. As a result, p99 latency dropped by 38% and database CPU utilization decreased by 45% during peak promotions.`;
    setUserAnswerText(sample);
  };

  const handleLoadFollowUpAnswer = () => {
    const sample = `To handle the 10x throughput surge, I would introduce partition key sharding and push writes asynchronously into a Kafka event queue with rate limiting. This shields downstream services from cascading collapse while ensuring idempotent reconciliation once the storm subsides.`;
    setUserFollowUpAnswerText(sample);
  };

  return (
    <div className="min-h-screen bg-[#24120a] text-[#f8eed8] flex flex-col font-sans select-none">
      
      {/* 1. Top Status & Information Bar */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-[#3a2318] bg-[#1a0c07]/90 backdrop-blur-md flex items-center justify-between z-30">
        
        {/* Left: Role & Category */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg text-[#f8eed8] leading-none">
                {config.jobRole}
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#b4532a]/30 text-[#dfa84c] px-2 py-0.5 rounded">
                {config.difficulty}
              </span>
            </div>
            <div className="text-[11px] text-[#f8eed8]/60 font-sans hidden sm:block">
              {activeQuestion.category} • {config.interviewType.toUpperCase()} ROUND
            </div>
          </div>
        </div>

        {/* Center: Question Progress */}
        <div className="flex items-center gap-2 bg-[#2a170f] px-3 py-1 rounded-full border border-[#f8eed8]/10 text-xs font-mono">
          <span className="text-[#dfa84c]">Question {currentQuestionIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span>{questions.length}</span>
        </div>

        {/* Right: Elapsed Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#f8eed8]/80 bg-[#2a170f] px-2.5 py-1 rounded-lg border border-[#f8eed8]/10">
            <Clock className="w-3.5 h-3.5 text-[#dfa84c]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPauseModalOpen(true)}
            className="p-2 rounded-lg bg-[#2a170f] hover:bg-[#3a2318] text-[#f8eed8]/80 hover:text-white transition-colors cursor-pointer"
            title="Pause Interview"
          >
            <Pause className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Round</span>
          </button>
        </div>
      </header>

      {/* 2. Main Stage: Virtual Room (Split Stage) */}
      <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Column (Lg: 7 cols) — AI Interviewer & Live Prompt */}
        <section className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-[#1e0f09] border border-[#3a2318] p-5 sm:p-7 relative overflow-hidden shadow-xl">
          
          {/* Subtle ambient vintage background aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#b4532a]/10 blur-3xl pointer-events-none" />

          {/* AI Header & Avatar Row */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#b4532a]/50 bg-[#3a2318] shrink-0 shadow-lg">
                  <img
                    src={selectedInterviewer.portraitUrl}
                    alt={selectedInterviewer.name}
                    className="w-full h-full object-cover"
                  />
                  {aiState === 'ai-speaking' && (
                    <div className="absolute inset-0 bg-[#b4532a]/40 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl text-[#f8eed8] leading-none">
                      {selectedInterviewer.name}
                    </h2>
                    <span className="text-[10px] font-mono uppercase text-[#dfa84c] bg-[#dfa84c]/10 px-2 py-0.5 rounded-full border border-[#dfa84c]/20">
                      AI Lead
                    </span>
                  </div>
                  <div className="text-xs text-[#f8eed8]/60 mt-1 font-sans">
                    {selectedInterviewer.personality} • {selectedInterviewer.accent}
                  </div>
                </div>
              </div>

              {/* AI State Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2a170f] border border-[#f8eed8]/10 text-xs font-mono">
                {aiState === 'ai-speaking' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#b4532a] animate-pulse" />
                    <span className="text-[#dfa84c]">AI is speaking</span>
                  </>
                ) : aiState === 'listening' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-emerald-400">Listening to you</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                    <span className="text-amber-300">Evaluating response</span>
                  </>
                )}
              </div>
            </div>

            {/* Simulated Live Audio Waveform (Animated SVG) */}
            <div className="h-8 flex items-center justify-center gap-1 my-3 bg-[#150a06] rounded-xl px-4 border border-[#3a2318]/50">
              {[12, 24, 40, 16, 28, 50, 32, 14, 45, 20, 36, 18, 48, 22, 16, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full transition-all duration-150"
                  style={{
                    height: aiState === 'ai-speaking' ? `${(h * 0.8) + (Math.sin(elapsedSeconds * 4 + i) * 12)}px` : '4px',
                    backgroundColor: aiState === 'ai-speaking' ? '#dfa84c' : '#3a2318'
                  }}
                />
              ))}
            </div>

            {/* Current Question Prominent Card */}
            <div className="mt-4 p-5 rounded-2xl bg-[#28150e]/90 border border-[#b4532a]/30 shadow-md">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#dfa84c] mb-2 uppercase tracking-wider">
                <span>Primary Interview Question</span>
                <span>Category: {activeQuestion.category}</span>
              </div>
              <p className="font-serif text-lg sm:text-xl lg:text-[22px] leading-snug text-[#fdfaf3] font-normal">
                "{activeQuestion.question}"
              </p>
            </div>

            {/* Follow-up Probing Card (Appears after candidate first responds) */}
            {hasAskedFollowUp && activeFollowUpText && (
              <div className="mt-3.5 p-4 rounded-xl bg-[#341a10] border border-[#dfa84c]/40 animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#dfa84c] mb-1 uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
                  <span>AI Adaptive Follow-Up Question</span>
                </div>
                <p className="font-serif text-base sm:text-lg text-[#fff7ea] italic leading-snug">
                  "{activeFollowUpText}"
                </p>
              </div>
            )}
          </div>

          {/* Bottom helper actions on AI side */}
          <div className="mt-6 pt-4 border-t border-[#3a2318] flex items-center justify-between text-xs text-[#f8eed8]/70">
            <button
              onClick={handleRepeatQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a170f] hover:bg-[#3a2318] text-[#f8eed8] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#dfa84c]" />
              <span>Repeat question aloud</span>
            </button>

            <div className="text-[11px] font-mono text-[#f8eed8]/50 hidden sm:block">
              {config.interviewStyle}
            </div>
          </div>
        </section>

        {/* Right Column (Lg: 5 cols) — Candidate Cam Feed & Spoken/Typed Answer Area */}
        <section className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#1e0f09] border border-[#3a2318] p-5 sm:p-6 shadow-xl">
          
          {/* Top Half: Candidate Camera Monitor */}
          <div className="relative rounded-2xl bg-[#140b07] border border-[#3a2318] overflow-hidden aspect-[16/10] flex items-center justify-center mb-4 shadow-inner">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="text-center p-4">
                <div className="w-14 h-14 rounded-full bg-[#b4532a] text-[#fdfaf3] flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-2 shadow-md">
                  You
                </div>
                <div className="text-xs font-mono text-[#f8eed8]/60">Camera Disabled • Audio Active</div>
              </div>
            )}

            {/* Candidate status tag */}
            <div className="absolute top-2.5 left-2.5 bg-[#140b07]/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono text-[#f8eed8] flex items-center gap-1.5 border border-[#f8eed8]/10">
              <span className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{!isMuted ? 'Microphone Active' : 'Muted'}</span>
            </div>

            {/* Quick in-video toggles */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-[#140b07]/80 text-[#f8eed8] hover:bg-black/90'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors ${
                  !isCameraActive ? 'bg-red-600 text-white' : 'bg-[#140b07]/80 text-[#f8eed8] hover:bg-black/90'
                }`}
                title={isCameraActive ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Half: Spoken / Typed Transcript Box */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#dfa84c] uppercase tracking-wider flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Your Answer (Speak or Type)</span>
                </span>

                {/* Instant STAR Answer Pre-fill Helper */}
                {!hasAskedFollowUp ? (
                  <button
                    type="button"
                    onClick={handleLoadSampleStarAnswer}
                    className="text-[10.5px] font-mono text-[#dfa84c] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load STAR sample answer</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLoadFollowUpAnswer}
                    className="text-[10.5px] font-mono text-[#dfa84c] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load follow-up sample answer</span>
                  </button>
                )}
              </div>

              {!hasAskedFollowUp ? (
                <textarea
                  rows={4}
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  placeholder="Speak your answer, or type here to simulate your spoken response..."
                  className="w-full p-3 rounded-xl bg-[#140b07] border border-[#3a2318] text-xs sm:text-sm text-[#f8eed8] placeholder:text-[#f8eed8]/30 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none"
                />
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#140b07]/70 border border-[#3a2318] text-[11px] text-[#f8eed8]/70 line-clamp-2">
                    <span className="font-semibold text-[#f8eed8]/90">Initial Answer: </span>
                    {userAnswerText}
                  </div>
                  <textarea
                    rows={3}
                    value={userFollowUpAnswerText}
                    onChange={(e) => setUserFollowUpAnswerText(e.target.value)}
                    placeholder="Address the AI interviewer's follow-up question here..."
                    className="w-full p-3 rounded-xl bg-[#140b07] border border-[#dfa84c]/40 text-xs sm:text-sm text-[#f8eed8] placeholder:text-[#f8eed8]/30 focus:outline-none focus:border-[#dfa84c] font-sans resize-none"
                  />
                </div>
              )}
            </div>

            {/* Answer Submit Controls */}
            <div className="mt-4 pt-3 border-t border-[#3a2318] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#f8eed8]/50">
                {!hasAskedFollowUp 
                  ? `${userAnswerText.trim().split(/\s+/).filter(Boolean).length} words` 
                  : `${userFollowUpAnswerText.trim().split(/\s+/).filter(Boolean).length} words`}
              </span>

              {!hasAskedFollowUp ? (
                <button
                  type="button"
                  onClick={handleSubmitPrimaryAnswer}
                  disabled={!userAnswerText.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] disabled:opacity-40 text-[#fbf7ee] text-xs font-medium transition-all shadow-md cursor-pointer"
                >
                  <span>Submit & Hear Follow-up</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteQuestion}
                  disabled={!userFollowUpAnswerText.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-medium transition-all shadow-md cursor-pointer"
                >
                  <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Complete Interview'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 3. Bottom Controls Dock */}
      <footer className="h-16 px-6 border-t border-[#3a2318] bg-[#1a0c07]/90 backdrop-blur-md flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-red-950/80 border-red-800 text-red-200'
                : 'bg-[#2a170f] border-[#3a2318] text-[#f8eed8] hover:bg-[#3a2318]'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all ${
              !isCameraActive
                ? 'bg-red-950/80 border-red-800 text-red-200'
                : 'bg-[#2a170f] border-[#3a2318] text-[#f8eed8] hover:bg-[#3a2318]'
            }`}
          >
            {isCameraActive ? <Camera className="w-3.5 h-3.5 text-emerald-400" /> : <CameraOff className="w-3.5 h-3.5 text-red-400" />}
            <span>{isCameraActive ? 'Camera On' : 'Camera Off'}</span>
          </button>

          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all ${
              showCaptions
                ? 'bg-[#3a2318] border-[#dfa84c]/40 text-[#dfa84c]'
                : 'bg-[#2a170f] border-[#3a2318] text-[#f8eed8]/60 hover:bg-[#3a2318]'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[#f8eed8]/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Room v2.4</span>
          </div>
        </div>
      </footer>

      {/* PAUSE MODAL */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#28150e] border border-[#3a2318] p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#dfa84c]/20 text-[#dfa84c] flex items-center justify-center mx-auto mb-3">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#f8eed8] mb-1">Interview Paused</h3>
            <p className="text-xs text-[#f8eed8]/70 font-sans mb-6">
              Your timer is frozen and responses are preserved. Take a breath, grab water, and resume whenever you’re ready.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Interview</span>
              </button>
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  exitToDashboard();
                }}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#3a2318] text-[#f8eed8]/80 text-xs font-medium transition-all cursor-pointer"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END ROUND CONFIRMATION MODAL */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#28150e] border border-red-900/50 p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center mx-auto mb-3">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#f8eed8] mb-1">Conclude Interview Round?</h3>
            <p className="text-xs text-[#f8eed8]/70 font-sans mb-4">
              You have completed {currentQuestionIndex + (userAnswerText ? 1 : 0)} of {questions.length} questions. Ending now will analyze your submitted answers and generate your full AI performance report.
            </p>
            
            <div className="p-3 rounded-xl bg-[#1a0c07] border border-[#3a2318] text-left text-xs mb-6 space-y-1 font-mono text-[#f8eed8]/80">
              <div className="flex justify-between">
                <span>Total Elapsed Time:</span>
                <span className="text-[#dfa84c]">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="text-[#dfa84c]">{currentQuestionIndex + (userAnswerText ? 1 : 0)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsEndModalOpen(false);
                  // Commit current turn if answer exists
                  if (userAnswerText.trim()) {
                    addTurn({
                      questionId: activeQuestion.id,
                      questionText: activeQuestion.question,
                      userAnswerText: userAnswerText.trim(),
                      audioDurationSeconds: Math.floor(elapsedSeconds),
                      answeredAt: new Date().toLocaleTimeString(),
                      followUpText: activeFollowUpText || undefined,
                      userFollowUpAnswerText: userFollowUpAnswerText.trim() || undefined
                    });
                  }
                  finishInterview();
                }}
                className="w-full py-3 rounded-full bg-red-700 hover:bg-red-600 text-white text-xs font-medium transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>End & Generate AI Report</span>
              </button>

              <button
                onClick={() => setIsEndModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#3a2318] text-[#f8eed8]/80 text-xs font-medium transition-all cursor-pointer"
              >
                Continue Practicing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
