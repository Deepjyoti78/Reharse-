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
  ShieldCheck,
  Radio,
  AlertCircle
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
  // 'ai-speaking' | 'listening' | 'processing'
  const [aiState, setAiState] = useState<'ai-speaking' | 'listening' | 'processing'>('ai-speaking');
  
  // Follow-up interaction tracking
  const [hasAskedFollowUp, setHasAskedFollowUp] = useState(false);
  const [activeFollowUpText, setActiveFollowUpText] = useState<string | null>(null);

  // User input
  const [userAnswerText, setUserAnswerText] = useState('');
  const [userFollowUpAnswerText, setUserFollowUpAnswerText] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(deviceState.cameraEnabled);
  const [showCaptions, setShowCaptions] = useState(true);

  // Speech Recognition state
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isSpeechListening, setIsSpeechListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Audio level meter
  const [audioVolume, setAudioVolume] = useState(0);

  // Modals
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Timers
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Video / Audio / Speech refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Synchronized state refs for event listeners
  const aiStateRef = useRef(aiState);
  aiStateRef.current = aiState;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const hasAskedFollowUpRef = useRef(hasAskedFollowUp);
  hasAskedFollowUpRef.current = hasAskedFollowUp;

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

  // Setup candidate webcam stream & Audio Analyser
  useEffect(() => {
    let isCancelled = false;

    const startMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isCameraActive ? { width: { ideal: 640 }, height: { ideal: 480 } } : false,
            audio: true
          });

          if (isCancelled) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }

          mediaStreamRef.current = stream;

          if (videoRef.current && isCameraActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }

          // Setup AudioContext Analyser to track live microphone input volume
          try {
            const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              audioContextRef.current = audioCtx;
              const source = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);
              analyserRef.current = analyser;

              const bufferLength = analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);

              const trackVolume = () => {
                if (analyserRef.current && !isMutedRef.current) {
                  analyserRef.current.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                  }
                  const avg = sum / bufferLength;
                  setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
                } else {
                  setAudioVolume(0);
                }
                animFrameRef.current = requestAnimationFrame(trackVolume);
              };

              trackVolume();
            }
          } catch (audioErr) {
            console.warn('Audio analyser fallback:', audioErr);
          }
        }
      } catch (e) {
        console.warn('Media feed fallback:', e);
      }
    };

    startMedia();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraActive]);

  // Handle Speech Recognition setup (Web Speech API)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = config.language === 'Hindi' ? 'hi-IN' : 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onstart = () => {
        setIsSpeechListening(true);
        setSpeechError(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript;
          } else {
            interim += transcript;
          }
        }

        if (finalChunk.trim()) {
          const cleanedChunk = finalChunk.trim();
          if (!hasAskedFollowUpRef.current) {
            setUserAnswerText(prev => {
              const current = prev.trim();
              return current ? `${current} ${cleanedChunk}` : cleanedChunk;
            });
          } else {
            setUserFollowUpAnswerText(prev => {
              const current = prev.trim();
              return current ? `${current} ${cleanedChunk}` : cleanedChunk;
            });
          }
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition warning:', event.error);
          if (event.error === 'not-allowed') {
            setSpeechError('Microphone permission blocked for speech recognition.');
            setIsSpeechListening(false);
          }
        }
      };

      recognition.onend = () => {
        setIsSpeechListening(false);
        // If still supposed to listen and not muted, seamlessly restart
        if (aiStateRef.current === 'listening' && !isMutedRef.current) {
          try {
            recognition.start();
          } catch {
            // Ignore start collisions
          }
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setIsSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, [config.language]);

  // Manage start / stop of speech recognition according to AI state and mute status
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (aiState === 'listening' && !isMuted) {
      try {
        recognitionRef.current.start();
      } catch {
        // Recognition might already be running
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch {
        // Recognition might already be stopped
      }
      setIsSpeechListening(false);
      setInterimTranscript('');
    }
  }, [aiState, isMuted]);

  // Speak AI question using SpeechSynthesis
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
    setInterimTranscript('');

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
    setInterimTranscript('');
    speakText(textToSpeak, () => {
      setAiState('listening');
    });
  };

  // Handle Submit Answer
  const handleSubmitPrimaryAnswer = () => {
    const answerToSubmit = (userAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    if (!answerToSubmit) return;

    if (interimTranscript) {
      setUserAnswerText(answerToSubmit);
      setInterimTranscript('');
    }

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
    const finalPrimary = userAnswerText.trim();
    const finalFollowUp = (userFollowUpAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim();

    const turnData: UserTurn = {
      questionId: activeQuestion.id,
      questionText: activeQuestion.question,
      userAnswerText: finalPrimary,
      audioDurationSeconds: Math.floor(elapsedSeconds / (currentQuestionIndex + 1)),
      answeredAt: new Date().toLocaleTimeString(),
      followUpText: activeFollowUpText || undefined,
      userFollowUpAnswerText: finalFollowUp || undefined
    };

    addTurn(turnData);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishInterview();
    }
  };

  // Sample answer loaders for instant test demonstration
  const handleLoadSampleStarAnswer = () => {
    const sample = `In my previous role scaling our checkout API, we encountered erratic latency spikes where the main database connection pool was exhausted. My task was to isolate the bottleneck without degrading the user cart experience. I implemented a Redis cache-aside proxy with probabilistic early expiration (XFetch algorithm) and wrapped slow read operations in circuit breakers. As a result, p99 latency dropped by 38% and database CPU utilization decreased by 45% during peak promotions.`;
    setUserAnswerText(sample);
    setInterimTranscript('');
  };

  const handleLoadFollowUpAnswer = () => {
    const sample = `To handle the 10x throughput surge, I would introduce partition key sharding and push writes asynchronously into a Kafka event queue with rate limiting. This shields downstream services from cascading collapse while ensuring idempotent reconciliation once the storm subsides.`;
    setUserFollowUpAnswerText(sample);
    setInterimTranscript('');
  };

  return (
    <div className="min-h-screen bg-[#f3e7c9] text-[#2a170f] flex flex-col font-sans select-none">
      
      {/* 1. Top Status & Information Bar (Editorial Warm Header) */}
      <header className="h-14 sm:h-16 px-4 sm:px-8 border-b border-[#3a2318]/15 bg-[#faf4e6]/95 backdrop-blur-md flex items-center justify-between z-30 shadow-xs">
        
        {/* Left: Role & Track */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-base sm:text-lg text-[#2a170f] leading-none font-semibold">
                {config.jobRole}
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#dfa84c]/20 text-[#8d3e1b] border border-[#dfa84c]/40 px-2 py-0.5 rounded font-medium">
                {config.difficulty}
              </span>
            </div>
            <div className="text-[11px] text-[#3a2318]/65 font-sans hidden sm:block">
              {activeQuestion.category} • {config.interviewType.toUpperCase()} ROUND
            </div>
          </div>
        </div>

        {/* Center: Question Progress */}
        <div className="flex items-center gap-2 bg-[#f0e3c5] px-3.5 py-1 rounded-full border border-[#3a2318]/15 text-xs font-mono text-[#2a170f]">
          <span className="text-[#b4532a] font-semibold">Question {currentQuestionIndex + 1}</span>
          <span className="opacity-40">/</span>
          <span>{questions.length}</span>
        </div>

        {/* Right: Elapsed Timer & Quick Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#2a170f] bg-[#f0e3c5] px-2.5 py-1 rounded-lg border border-[#3a2318]/15">
            <Clock className="w-3.5 h-3.5 text-[#b4532a]" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPauseModalOpen(true)}
            className="p-2 rounded-lg bg-[#f0e3c5] hover:bg-[#e7d8b5] text-[#2a170f] border border-[#3a2318]/15 transition-colors cursor-pointer"
            title="Pause Interview"
          >
            <Pause className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEndModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Round</span>
          </button>
        </div>
      </header>

      {/* 2. Main Stage: Virtual Room (Split Stage Light Theme) */}
      <main className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Left Column (Lg: 7 cols) — AI Interviewer & Live Prompt */}
        <section className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-[#faf4e6] border border-[#3a2318]/15 p-5 sm:p-7 relative overflow-hidden shadow-sm">
          
          {/* Subtle ambient vintage background aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#dfa84c]/15 blur-3xl pointer-events-none" />

          {/* AI Header & Avatar Row */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#b4532a]/40 bg-[#f0e3c5] shrink-0 shadow-sm">
                  <img
                    src={selectedInterviewer.portraitUrl}
                    alt={selectedInterviewer.name}
                    className="w-full h-full object-cover"
                  />
                  {aiState === 'ai-speaking' && (
                    <div className="absolute inset-0 bg-[#b4532a]/20 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#b4532a] animate-ping" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl text-[#2a170f] leading-none font-semibold">
                      {selectedInterviewer.name}
                    </h2>
                    <span className="text-[10px] font-mono uppercase text-[#8d3e1b] bg-[#f0e3c5] px-2 py-0.5 rounded-full border border-[#3a2318]/15">
                      AI Lead
                    </span>
                  </div>
                  <div className="text-xs text-[#3a2318]/70 mt-1 font-sans">
                    {selectedInterviewer.personality} • {selectedInterviewer.accent}
                  </div>
                </div>
              </div>

              {/* AI State Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f0e3c5] border border-[#3a2318]/15 text-xs font-mono">
                {aiState === 'ai-speaking' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#b4532a] animate-pulse" />
                    <span className="text-[#8d3e1b] font-medium">AI is speaking</span>
                  </>
                ) : aiState === 'listening' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-emerald-800 font-medium">Listening to you</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                    <span className="text-amber-800 font-medium">Evaluating response</span>
                  </>
                )}
              </div>
            </div>

            {/* Audio Waveform Graphic */}
            <div className="h-9 flex items-center justify-center gap-1 my-3 bg-[#f0e3c5]/70 rounded-xl px-4 border border-[#3a2318]/15">
              {[12, 24, 40, 16, 28, 50, 32, 14, 45, 20, 36, 18, 48, 22, 16, 30].map((h, i) => {
                const isAiSpeaking = aiState === 'ai-speaking';
                const isUserSpeaking = aiState === 'listening' && (audioVolume > 15 || isSpeechListening);
                
                let barHeight = 4;
                let barColor = '#3a2318]/25';

                if (isAiSpeaking) {
                  barHeight = Math.max(6, Math.min(32, (h * 0.7) + (Math.sin(elapsedSeconds * 4 + i) * 10)));
                  barColor = '#b4532a';
                } else if (isUserSpeaking) {
                  barHeight = Math.max(6, Math.min(32, (audioVolume * 0.3) + (Math.sin(i * 1.5) * 6)));
                  barColor = '#5b8076';
                }

                return (
                  <div
                    key={i}
                    className="w-1.5 rounded-full transition-all duration-150"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: barColor === '#b4532a' ? '#b4532a' : barColor === '#5b8076' ? '#5b8076' : 'rgba(58, 35, 24, 0.25)'
                    }}
                  />
                );
              })}
            </div>

            {/* Current Primary Question Card */}
            <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-[#f5ecda] border border-[#3a2318]/15 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#b4532a] mb-2 uppercase tracking-wider font-semibold">
                <span>Primary Interview Question</span>
                <span>Category: {activeQuestion.category}</span>
              </div>
              <p className="font-serif text-lg sm:text-xl lg:text-[22px] leading-snug text-[#2a170f] font-normal">
                "{activeQuestion.question}"
              </p>
            </div>

            {/* Follow-up Probing Card (Appears after candidate first responds) */}
            {hasAskedFollowUp && activeFollowUpText && (
              <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-[#faf2e1] border-2 border-[#b4532a]/30 shadow-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b4532a] mb-1.5 uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
                  <span>AI Adaptive Follow-Up Question</span>
                </div>
                <p className="font-serif text-base sm:text-lg text-[#2a170f] italic leading-snug">
                  "{activeFollowUpText}"
                </p>
              </div>
            )}
          </div>

          {/* Bottom helper actions on AI side */}
          <div className="mt-6 pt-4 border-t border-[#3a2318]/15 flex items-center justify-between text-xs text-[#3a2318]/70">
            <button
              onClick={handleRepeatQuestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f0e3c5] hover:bg-[#e7d8b5] border border-[#3a2318]/15 text-[#2a170f] transition-colors cursor-pointer font-medium shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#b4532a]" />
              <span>Repeat question aloud</span>
            </button>

            <div className="text-[11px] font-mono text-[#3a2318]/60 hidden sm:block">
              {config.interviewStyle}
            </div>
          </div>
        </section>

        {/* Right Column (Lg: 5 cols) — Candidate Cam Feed & Live Voice/Text Response Area */}
        <section className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#faf4e6] border border-[#3a2318]/15 p-5 sm:p-6 shadow-sm">
          
          {/* Top Half: Candidate Camera Monitor */}
          <div className="relative rounded-2xl bg-[#ede0c2] border border-[#3a2318]/15 overflow-hidden aspect-[16/10] flex items-center justify-center mb-4 shadow-inner">
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
                <div className="text-xs font-mono text-[#3a2318]/70">Camera Disabled • Audio Active</div>
              </div>
            )}

            {/* Candidate status tag with live volume meter */}
            <div className="absolute top-2.5 left-2.5 bg-[#2a170f]/75 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-mono text-[#faf4e6] flex items-center gap-2 border border-white/10 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{!isMuted ? 'Microphone Active' : 'Muted'}</span>
              {!isMuted && audioVolume > 5 && (
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-2 rounded-full bg-emerald-400" />
                  <span className={`w-1 h-3 rounded-full ${audioVolume > 20 ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
                  <span className={`w-1 h-4 rounded-full ${audioVolume > 40 ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
                </div>
              )}
            </div>

            {/* Quick in-video toggles */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors cursor-pointer ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-[#2a170f]/75 text-[#faf4e6] hover:bg-[#2a170f]'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors cursor-pointer ${
                  !isCameraActive ? 'bg-red-600 text-white' : 'bg-[#2a170f]/75 text-[#faf4e6] hover:bg-[#2a170f]'
                }`}
                title={isCameraActive ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Half: Live Speech-to-Text Transcription Box */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#b4532a] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Spoken Answer (Live Transcribed)</span>
                </span>

                {/* Instant STAR Answer Pre-fill Helper */}
                {!hasAskedFollowUp ? (
                  <button
                    type="button"
                    onClick={handleLoadSampleStarAnswer}
                    className="text-[10.5px] font-mono text-[#b4532a] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load STAR sample</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLoadFollowUpAnswer}
                    className="text-[10.5px] font-mono text-[#b4532a] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Load follow-up sample</span>
                  </button>
                )}
              </div>

              {/* Real-time Voice Transcription Banner */}
              <div className="mb-2.5 p-2 rounded-xl bg-[#f0e3c5]/80 border border-[#3a2318]/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    aiState === 'listening' && !isMuted 
                      ? 'bg-emerald-600 animate-ping' 
                      : 'bg-[#3a2318]/30'
                  }`} />
                  <span className="font-mono text-[11px] text-[#2a170f]">
                    {aiState === 'ai-speaking' 
                      ? 'Interviewer is speaking...' 
                      : isMuted 
                        ? 'Microphone muted' 
                        : isSpeechListening 
                          ? 'Voice system active — speak clearly now' 
                          : 'Microphone listening...'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10.5px] font-mono text-[#3a2318]/65">
                  <Radio className="w-3 h-3 text-[#b4532a] animate-pulse" />
                  <span>Real-time STT</span>
                </div>
              </div>

              {speechError && (
                <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{speechError} You can still type directly in the box below.</span>
                </div>
              )}

              {/* Textarea for Transcribed Voice & Typed Response */}
              {!hasAskedFollowUp ? (
                <div className="relative">
                  <textarea
                    rows={4}
                    value={userAnswerText}
                    onChange={(e) => {
                      setUserAnswerText(e.target.value);
                      setInterimTranscript('');
                    }}
                    placeholder={
                      isSpeechSupported 
                        ? "Speak your answer into your microphone (words will transcribe here automatically) or type directly..."
                        : "Type your answer here to simulate your response..."
                    }
                    className="w-full p-3.5 rounded-xl bg-white border border-[#3a2318]/20 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none shadow-xs leading-relaxed"
                  />
                  {interimTranscript && (
                    <div className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300/60 text-emerald-900 text-xs italic flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                      <span className="font-medium">Live speech:</span>
                      <span>"{interimTranscript}"</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#f0e3c5]/70 border border-[#3a2318]/15 text-[11px] text-[#3a2318]/80 line-clamp-2">
                    <span className="font-semibold text-[#2a170f]">Initial Answer: </span>
                    {userAnswerText}
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={userFollowUpAnswerText}
                      onChange={(e) => {
                        setUserFollowUpAnswerText(e.target.value);
                        setInterimTranscript('');
                      }}
                      placeholder="Speak or type your follow-up answer addressing the AI's question..."
                      className="w-full p-3.5 rounded-xl bg-white border border-[#b4532a]/40 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none shadow-xs leading-relaxed"
                    />
                    {interimTranscript && (
                      <div className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300/60 text-emerald-900 text-xs italic flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                        <span className="font-medium">Live speech:</span>
                        <span>"{interimTranscript}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Submit Controls */}
            <div className="mt-4 pt-3 border-t border-[#3a2318]/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#3a2318]/60">
                {!hasAskedFollowUp 
                  ? `${userAnswerText.trim().split(/\s+/).filter(Boolean).length} words spoken` 
                  : `${userFollowUpAnswerText.trim().split(/\s+/).filter(Boolean).length} words spoken`}
              </span>

              {!hasAskedFollowUp ? (
                <button
                  type="button"
                  onClick={handleSubmitPrimaryAnswer}
                  disabled={!userAnswerText.trim() && !interimTranscript.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] disabled:opacity-40 text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>Submit & Hear Follow-up</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteQuestion}
                  disabled={!userFollowUpAnswerText.trim() && !interimTranscript.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#5b8076] hover:bg-[#47655d] disabled:opacity-40 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Complete Interview'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 3. Bottom Controls Dock (Light Editorial Theme) */}
      <footer className="h-16 px-6 border-t border-[#3a2318]/15 bg-[#faf4e6]/95 backdrop-blur-md flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
              isMuted
                ? 'bg-red-100 border-red-300 text-red-800'
                : 'bg-[#f0e3c5] hover:bg-[#e7d8b5] border-[#3a2318]/15 text-[#2a170f]'
            }`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-600" /> : <Mic className="w-3.5 h-3.5 text-emerald-700" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
              !isCameraActive
                ? 'bg-red-100 border-red-300 text-red-800'
                : 'bg-[#f0e3c5] hover:bg-[#e7d8b5] border-[#3a2318]/15 text-[#2a170f]'
            }`}
          >
            {isCameraActive ? <Camera className="w-3.5 h-3.5 text-emerald-700" /> : <CameraOff className="w-3.5 h-3.5 text-red-600" />}
            <span>{isCameraActive ? 'Camera On' : 'Camera Off'}</span>
          </button>

          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
              showCaptions
                ? 'bg-[#dfa84c]/20 border-[#dfa84c]/60 text-[#8d3e1b]'
                : 'bg-[#f0e3c5] hover:bg-[#e7d8b5] border-[#3a2318]/15 text-[#2a170f]/70'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[#3a2318]/70">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Encrypted Room v2.4</span>
          </div>
        </div>
      </footer>

      {/* PAUSE MODAL (Light Theme) */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#faf4e6] border border-[#3a2318]/20 p-6 sm:p-7 max-w-md w-full shadow-2xl text-center text-[#2a170f]">
            <div className="w-12 h-12 rounded-full bg-[#dfa84c]/20 text-[#8d3e1b] flex items-center justify-center mx-auto mb-3">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2a170f] font-semibold mb-1">Interview Paused</h3>
            <p className="text-xs text-[#3a2318]/75 font-sans mb-6">
              Your timer is frozen and responses are preserved. Take a breath, grab water, and resume whenever you're ready.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Interview</span>
              </button>
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  exitToDashboard();
                }}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#f0e3c5] text-[#2a170f]/80 text-xs font-medium transition-all cursor-pointer"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END ROUND CONFIRMATION MODAL (Light Theme) */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="rounded-3xl bg-[#faf4e6] border border-red-200 p-6 sm:p-7 max-w-md w-full shadow-2xl text-center text-[#2a170f]">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2a170f] font-semibold mb-1">Conclude Interview Round?</h3>
            <p className="text-xs text-[#3a2318]/75 font-sans mb-4">
              You have completed {currentQuestionIndex + (userAnswerText ? 1 : 0)} of {questions.length} questions. Ending now will analyze your submitted answers and generate your full AI performance report.
            </p>
            
            <div className="p-3.5 rounded-xl bg-[#f5ecda] border border-[#3a2318]/15 text-left text-xs mb-6 space-y-1.5 font-mono text-[#2a170f]">
              <div className="flex justify-between">
                <span>Total Elapsed Time:</span>
                <span className="text-[#b4532a] font-semibold">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="flex justify-between">
                <span>Questions Answered:</span>
                <span className="text-[#b4532a] font-semibold">{currentQuestionIndex + (userAnswerText ? 1 : 0)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setIsEndModalOpen(false);
                  // Commit current turn if answer exists
                  if (userAnswerText.trim() || interimTranscript.trim()) {
                    addTurn({
                      questionId: activeQuestion.id,
                      questionText: activeQuestion.question,
                      userAnswerText: (userAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim(),
                      audioDurationSeconds: Math.floor(elapsedSeconds),
                      answeredAt: new Date().toLocaleTimeString(),
                      followUpText: activeFollowUpText || undefined,
                      userFollowUpAnswerText: userFollowUpAnswerText.trim() || undefined
                    });
                  }
                  finishInterview();
                }}
                className="w-full py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>End & Generate AI Report</span>
              </button>

              <button
                onClick={() => setIsEndModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#f0e3c5] text-[#2a170f]/80 text-xs font-medium transition-all cursor-pointer"
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
