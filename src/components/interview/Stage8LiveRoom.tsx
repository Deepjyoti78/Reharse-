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
  AlertCircle,
  Square,
  Trash2
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { getQuestionsForConfig } from '../../data/interviewBank';
import type { QuestionItem, UserTurn } from '../../types/interview';
import { 
  playElevenLabsSpeech, 
  stopElevenLabsSpeech, 
  isElevenLabsConfigured, 
  transcribeSpeechWithElevenLabs 
} from '../../services/elevenlabs';

export const Stage8LiveRoom: React.FC = () => {
  const { 
    config, 
    selectedInterviewer, 
    deviceState, 
    turns,
    addTurn, 
    finishInterview, 
    exitToDashboard 
  } = useInterview();

  // Load question bank for this session
  const [questions] = useState<QuestionItem[]>(() => getQuestionsForConfig(config));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const activeQuestion = questions[currentQuestionIndex] || questions[0];

  // Conversation & AI States: 'ai-speaking' | 'listening' | 'processing'
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

  // Speech Recognition & Audio Recording state
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronized state refs for event listeners
  const aiStateRef = useRef(aiState);
  aiStateRef.current = aiState;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const hasAskedFollowUpRef = useRef(hasAskedFollowUp);
  hasAskedFollowUpRef.current = hasAskedFollowUp;
  const isRecordingVoiceRef = useRef(isRecordingVoice);
  isRecordingVoiceRef.current = isRecordingVoice;

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

  // Helper to commit transcript chunk to current active answer
  const appendToCurrentAnswer = (chunk: string) => {
    const text = chunk.trim();
    if (!text) return;
    if (!hasAskedFollowUpRef.current) {
      setUserAnswerText(prev => prev.trim() ? `${prev.trim()} ${text}` : text);
    } else {
      setUserFollowUpAnswerText(prev => prev.trim() ? `${prev.trim()} ${text}` : text);
    }
  };

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
          appendToCurrentAnswer(finalChunk);
          setInterimTranscript('');
        } else {
          setInterimTranscript(interim);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.warn('Web speech engine note:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechError('Microphone permission blocked. Please click the camera/microphone icon in your browser address bar to allow access.');
          stopRecordingAudio();
        }
        // Note: 'network' and 'no-speech' are non-fatal!
        // We do NOT abort; MediaRecorder captures audio locally and ElevenLabs Scribe transcribes it.
      };

      recognition.onend = () => {
        // Seamless restart if user is actively recording and not muted
        if (isRecordingVoiceRef.current && !isMutedRef.current && aiStateRef.current === 'listening') {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isRecordingVoiceRef.current && !isMutedRef.current) {
              try {
                recognition.start();
              } catch {
                // Ignore start collision
              }
            }
          }, 200);
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition init error:', err);
      setIsSpeechSupported(false);
    }

    return () => {
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
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

  // Start real audio recording via MediaRecorder + parallel Web Speech
  const startRecordingAudio = async () => {
    setSpeechError(null);
    setIsRecordingVoice(true);
    if (isMuted) setIsMuted(false);
    audioChunksRef.current = [];

    // 1. Start browser MediaRecorder (runs 100% locally on the device, immune to network drops or adblockers)
    try {
      let stream = mediaStreamRef.current;
      if (!stream || !stream.getAudioTracks().some(t => t.readyState === 'live')) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
      }

      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = MediaRecorder.isTypeSupported('audio/webm') 
            ? 'audio/webm' 
            : MediaRecorder.isTypeSupported('audio/mp4') 
              ? 'audio/mp4' 
              : '';
        }

        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        recorder.start(250);
        mediaRecorderRef.current = recorder;
      }
    } catch (e) {
      console.warn('MediaRecorder init note:', e);
    }

    // 2. Start Web Speech recognition in parallel (live preview if available)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // Ignore already started errors
      }
    }
  };

  // Stop recording and process transcription with ElevenLabs Scribe
  const stopRecordingAudio = () => {
    setIsRecordingVoice(false);

    // Stop Web Speech
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    // Commit any interim text
    if (interimTranscript.trim()) {
      appendToCurrentAnswer(interimTranscript);
      setInterimTranscript('');
    }

    // Stop MediaRecorder and transcribe audio chunks
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      const recorder = mediaRecorderRef.current;
      
      recorder.onstop = async () => {
        const chunks = audioChunksRef.current;
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          
          if (blob.size > 1200 && isElevenLabsConfigured()) {
            try {
              setIsTranscribing(true);
              const language = config.language === 'Hindi' ? 'hi' : 'en';
              const transcribedText = await transcribeSpeechWithElevenLabs(blob, language);
              
              if (transcribedText) {
                appendToCurrentAnswer(transcribedText);
              }
            } catch (err) {
              console.warn('ElevenLabs STT transcription note:', err);
            } finally {
              setIsTranscribing(false);
            }
          }
        }
      };

      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
  };

  // Direct toggle for candidate speech recording
  const handleToggleVoiceRecording = () => {
    if (isRecordingVoice) {
      stopRecordingAudio();
    } else {
      startRecordingAudio();
    }
  };

  // Speak AI question using ElevenLabs studio voice (with SpeechSynthesis fallback)
  const speakText = (text: string, onDone?: () => void) => {
    stopElevenLabsSpeech();

    playElevenLabsSpeech({
      text,
      voiceId: selectedInterviewer.voiceId,
      speakingRate: selectedInterviewer.speakingPace || 1.0,
      voiceGender: selectedInterviewer.voiceGender,
      onStart: () => {
        setAiState('ai-speaking');
      },
      onEnded: () => {
        if (onDone) onDone();
      },
      onError: (err) => {
        console.warn('Voice playback note:', err);
        if (onDone) onDone();
      }
    });
  };

  // When question changes, speak question and prepare candidate turn
  useEffect(() => {
    setAiState('ai-speaking');
    setHasAskedFollowUp(false);
    setActiveFollowUpText(null);
    setUserAnswerText('');
    setUserFollowUpAnswerText('');
    setInterimTranscript('');

    // Stop recording while AI speaks
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecordingVoice(false);

    speakText(activeQuestion.question, () => {
      setAiState('listening');
      // Automatically attempt to start voice listening if permitted
      if (recognitionRef.current && !isMutedRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecordingVoice(true);
        } catch {
          // May require click gesture on some browser configs; fallback button is visible
        }
      }
    });

    return () => {
      stopElevenLabsSpeech();
    };
  }, [currentQuestionIndex]);

  // Handle Repeat Question
  const handleRepeatQuestion = () => {
    const textToSpeak = hasAskedFollowUp && activeFollowUpText ? activeFollowUpText : activeQuestion.question;
    setAiState('ai-speaking');
    setInterimTranscript('');
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecordingVoice(false);

    speakText(textToSpeak, () => {
      setAiState('listening');
      if (recognitionRef.current && !isMutedRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecordingVoice(true);
        } catch {}
      }
    });
  };

  // Handle Submit Primary Answer
  const handleSubmitPrimaryAnswer = () => {
    // Commit any remaining interim speech
    const fullText = (userAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim();
    if (!fullText) return;

    setUserAnswerText(fullText);
    setInterimTranscript('');

    // Stop recording while AI evaluates & asks follow-up
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecordingVoice(false);

    stopElevenLabsSpeech();

    setAiState('processing');

    setTimeout(() => {
      const followUp = activeQuestion.sampleFollowUp || 
        `Interesting point. Can you drill into the failure modes of that approach if throughput suddenly scales 10x?`;
      
      setActiveFollowUpText(followUp);
      setHasAskedFollowUp(true);
      setAiState('ai-speaking');

      speakText(followUp, () => {
        setAiState('listening');
        if (recognitionRef.current && !isMutedRef.current) {
          try {
            recognitionRef.current.start();
            setIsRecordingVoice(true);
          } catch {}
        }
      });
    }, 1200);
  };

  // Handle Submit Follow-up & Move to next question or end
  const handleCompleteQuestion = () => {
    const finalPrimary = userAnswerText.trim();
    const finalFollowUp = (userFollowUpAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim();

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecordingVoice(false);

    const turnData: UserTurn = {
      questionId: activeQuestion.id,
      questionText: activeQuestion.question,
      userAnswerText: finalPrimary,
      audioDurationSeconds: Math.floor(elapsedSeconds / (currentQuestionIndex + 1)),
      answeredAt: new Date().toLocaleTimeString(),
      followUpText: activeFollowUpText || undefined,
      userFollowUpAnswerText: finalFollowUp || undefined
    };

    const updatedTurns = [...turns, turnData];
    addTurn(turnData);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishInterview(updatedTurns);
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

  const handleClearCurrentAnswer = () => {
    if (!hasAskedFollowUp) {
      setUserAnswerText('');
    } else {
      setUserFollowUpAnswerText('');
    }
    setInterimTranscript('');
  };

  return (
    <div className="min-h-screen bg-[#f3e7c9] text-[#2a170f] flex flex-col font-sans select-none relative">
      
      {/* 1. Top Status & Information Bar (Floating Console Capsule) */}
      <div className="w-full px-3 sm:px-6 md:px-8 pt-3 sm:pt-4 z-30">
        <header className="max-w-7xl mx-auto rounded-2xl bg-[#faf0d8]/95 backdrop-blur-md border border-[#3a2318]/15 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          
          {/* Left: Role, Track & Level */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="absolute w-4 h-4 rounded-full bg-emerald-500/25 animate-ping" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg text-[#2a170f] leading-none font-semibold truncate">
                  {config.jobRole}
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#dfa84c]/20 text-[#8d3e1b] border border-[#dfa84c]/40 px-2 py-0.5 rounded-md font-semibold shrink-0">
                  {config.difficulty}
                </span>
              </div>
              <div className="text-[11px] text-[#3a2318]/65 font-sans hidden sm:block truncate mt-0.5">
                {activeQuestion.category} • {config.interviewType.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Center: Question Progress */}
          <div className="flex items-center gap-2 bg-[#f0e3c5] px-3.5 py-1.5 rounded-full border border-[#3a2318]/15 text-xs font-mono text-[#2a170f]">
            <span className="text-[#b4532a] font-bold">Q {currentQuestionIndex + 1}</span>
            <span className="opacity-40">/</span>
            <span className="font-medium">{questions.length}</span>
            <span className="text-[10px] font-sans text-[#3a2318]/60 ml-1 hidden md:inline">
              ({Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%)
            </span>
          </div>

          {/* Right: Elapsed Timer & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#2a170f] bg-[#f0e3c5] px-3 py-1.5 rounded-xl border border-[#3a2318]/15 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#b4532a]" />
              <span className="font-medium">{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => {
                stopElevenLabsSpeech();
                setIsPauseModalOpen(true);
              }}
              className="p-2 rounded-xl bg-[#f0e3c5] hover:bg-[#e7d8b5] text-[#2a170f] border border-[#3a2318]/15 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              title="Pause Interview"
              aria-label="Pause Interview"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                stopElevenLabsSpeech();
                setIsEndModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">End Round</span>
            </button>
          </div>
        </header>
      </div>

      {/* 2. Main Stage: Virtual Room (Mobile Responsive Stack & Scroll with Bottom Dock Clearance) */}
      <main className="flex-1 p-3 sm:p-5 md:p-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Left Column (Lg: 7 cols) — AI Interviewer & Live Prompt */}
        <section className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 p-5 sm:p-6 md:p-7 relative overflow-hidden shadow-sm">
          
          {/* Subtle ambient vintage background aura */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#dfa84c]/15 blur-3xl pointer-events-none" />

          {/* AI Header & Avatar Row */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#b4532a]/40 bg-[#f0e3c5] shrink-0 shadow-sm">
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
                    <h2 className="font-serif text-xl sm:text-2xl text-[#2a170f] leading-none font-semibold">
                      {selectedInterviewer.name}
                    </h2>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#8d3e1b] bg-[#f0e3c5] px-2 py-0.5 rounded-full border border-[#3a2318]/15">
                      AI Lead
                    </span>
                    {isElevenLabsConfigured() && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-700" />
                        ElevenLabs Studio Voice
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#3a2318]/70 mt-1 font-sans">
                    {selectedInterviewer.personality} • {selectedInterviewer.accent}
                  </div>
                </div>
              </div>

              {/* AI State Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#f0e3c5] border border-[#3a2318]/15 text-[11px] sm:text-xs font-mono shrink-0">
                {aiState === 'ai-speaking' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#b4532a] animate-pulse" />
                    <span className="text-[#8d3e1b] font-medium">AI speaking</span>
                  </>
                ) : aiState === 'listening' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-emerald-800 font-medium">Listening to you</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                    <span className="text-amber-800 font-medium">Evaluating</span>
                  </>
                )}
              </div>
            </div>

            {/* Audio Waveform Graphic */}
            <div className="h-8 sm:h-9 flex items-center justify-center gap-1 my-3 bg-[#f0e3c5]/70 rounded-xl px-4 border border-[#3a2318]/15">
              {[12, 24, 40, 16, 28, 50, 32, 14, 45, 20, 36, 18, 48, 22, 16, 30].map((h, i) => {
                const isAiSpeaking = aiState === 'ai-speaking';
                const isUserSpeaking = (isRecordingVoice || audioVolume > 15) && aiState === 'listening';
                
                let barHeight = 4;
                let barColor = '#3a2318]/25';

                if (isAiSpeaking) {
                  barHeight = Math.max(6, Math.min(30, (h * 0.7) + (Math.sin(elapsedSeconds * 4 + i) * 10)));
                  barColor = '#b4532a';
                } else if (isUserSpeaking) {
                  barHeight = Math.max(6, Math.min(30, (audioVolume * 0.3) + (Math.sin(i * 1.5) * 6)));
                  barColor = '#5b8076';
                }

                return (
                  <div
                    key={i}
                    className="w-1 sm:w-1.5 rounded-full transition-all duration-150"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: barColor === '#b4532a' ? '#b4532a' : barColor === '#5b8076' ? '#5b8076' : 'rgba(58, 35, 24, 0.25)'
                    }}
                  />
                );
              })}
            </div>

            {/* Current Primary Question Card with Smooth Transition on Next Question */}
            <div key={activeQuestion.id} className="mt-3 sm:mt-4 p-4 sm:p-6 rounded-2xl bg-[#f5ecda] border border-[#3a2318]/15 shadow-xs animate-fade-in-up">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#b4532a] mb-2 uppercase tracking-wider font-semibold">
                <span>Primary Question</span>
                <span className="truncate max-w-[180px] sm:max-w-none">{activeQuestion.category}</span>
              </div>
              <p className="font-serif text-base sm:text-xl lg:text-[22px] leading-snug text-[#2a170f] font-normal">
                "{activeQuestion.question}"
              </p>
            </div>

            {/* Follow-up Probing Card (Appears after candidate first responds) */}
            {hasAskedFollowUp && activeFollowUpText && (
              <div className="mt-3 p-3.5 sm:p-5 rounded-2xl bg-[#faf2e1] border-2 border-[#b4532a]/30 shadow-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-[#b4532a] mb-1.5 uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
                  <span>AI Adaptive Follow-Up Question</span>
                </div>
                <p className="font-serif text-sm sm:text-lg text-[#2a170f] italic leading-snug">
                  "{activeFollowUpText}"
                </p>
              </div>
            )}
          </div>

          {/* Bottom helper actions on AI side */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#3a2318]/15 flex items-center justify-between text-xs text-[#3a2318]/70">
            <button
              onClick={handleRepeatQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f0e3c5] hover:bg-[#e7d8b5] border border-[#3a2318]/15 text-[#2a170f] transition-colors cursor-pointer font-medium shadow-xs text-xs"
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
        <section className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 p-4 sm:p-6 shadow-sm">
          
          {/* Top Half: Candidate Camera Monitor (Optimized for Mobile Height) */}
          <div className="relative rounded-2xl bg-[#ede0c2] border border-[#3a2318]/15 overflow-hidden aspect-[16/10] max-h-[170px] sm:max-h-[220px] lg:max-h-none flex items-center justify-center mb-4 shadow-inner">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <div className="text-center p-3">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#b4532a] text-[#fdfaf3] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold mx-auto mb-1.5 shadow-md">
                  You
                </div>
                <div className="text-[11px] font-mono text-[#3a2318]/70">Camera Disabled • Audio Active</div>
              </div>
            )}

            {/* Candidate status tag with live volume meter */}
            <div className="absolute top-2 left-2 bg-[#2a170f]/80 backdrop-blur-xs px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-mono text-[#faf4e6] flex items-center gap-1.5 border border-white/10 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{!isMuted ? (isRecordingVoice ? 'Recording' : 'Mic Active') : 'Muted'}</span>
              {!isMuted && audioVolume > 5 && (
                <div className="flex items-center gap-0.5 ml-0.5">
                  <span className="w-0.5 sm:w-1 h-2 rounded-full bg-emerald-400" />
                  <span className={`w-0.5 sm:w-1 h-3 rounded-full ${audioVolume > 20 ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
                  <span className={`w-0.5 sm:w-1 h-4 rounded-full ${audioVolume > 40 ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
                </div>
              )}
            </div>

            {/* Quick in-video toggles */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors cursor-pointer ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-[#2a170f]/80 text-[#faf4e6] hover:bg-[#2a170f]'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                aria-label="Toggle mute"
              >
                {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsCameraActive(!isCameraActive)}
                className={`p-1.5 rounded-lg text-xs backdrop-blur-xs transition-colors cursor-pointer ${
                  !isCameraActive ? 'bg-red-600 text-white' : 'bg-[#2a170f]/80 text-[#faf4e6] hover:bg-[#2a170f]'
                }`}
                title={isCameraActive ? 'Turn off camera' : 'Turn on camera'}
                aria-label="Toggle camera"
              >
                {isCameraActive ? <Camera className="w-3.5 h-3.5" /> : <CameraOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Half: Live Speech-to-Text Transcription Box */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                <span className="text-[10.5px] sm:text-[11px] font-mono text-[#b4532a] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Candidate Response</span>
                </span>

                {/* Instant STAR Answer Pre-fill & Clear Helpers */}
                <div className="flex items-center gap-2">
                  {(userAnswerText || userFollowUpAnswerText) && (
                    <button
                      type="button"
                      onClick={handleClearCurrentAnswer}
                      className="text-[10px] sm:text-[10.5px] font-mono text-[#9c3a1a] hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Clear answer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}

                  {!hasAskedFollowUp ? (
                    <button
                      type="button"
                      onClick={handleLoadSampleStarAnswer}
                      className="text-[10px] sm:text-[10.5px] font-mono text-[#b4532a] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>STAR sample</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLoadFollowUpAnswer}
                      className="text-[10px] sm:text-[10.5px] font-mono text-[#b4532a] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Follow-up sample</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dedicated "TAP TO SPEAK" Interactive Control Button */}
              <div className="mb-2.5">
                <button
                  type="button"
                  onClick={handleToggleVoiceRecording}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between shadow-xs cursor-pointer border ${
                    isRecordingVoice
                      ? 'bg-[#b4532a] hover:bg-[#97421f] text-white border-[#b4532a] ring-2 ring-[#b4532a]/30'
                      : 'bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] border-[#3a2318]/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isRecordingVoice ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-200 animate-ping" />
                        <span className="font-semibold">Recording voice... (Speak now)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-[#b4532a]" />
                        <span>Tap to speak into microphone</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[10.5px]">
                    {isRecordingVoice ? (
                      <span className="bg-black/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <Square className="w-3 h-3 fill-current" /> Tap when done
                      </span>
                    ) : (
                      <span className="opacity-75">Click to talk</span>
                    )}
                  </div>
                </button>
              </div>

              {/* Transcribing with ElevenLabs Scribe AI Status */}
              {isTranscribing && (
                <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span className="font-medium text-[11.5px]">Transcribing your voice with ElevenLabs Scribe AI...</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    High Accuracy
                  </span>
                </div>
              )}

              {/* Error Message if Browser Blocks Speech Recognition */}
              {speechError && (
                <div className="mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-[11.5px] leading-tight">
                    <span>{speechError}</span>
                    <span className="block mt-0.5 font-medium">You can also type your answer directly in the box below.</span>
                  </div>
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
                      isRecordingVoice
                        ? "Transcribing your spoken answer live... (You can also type to edit)"
                        : isSpeechSupported
                          ? "Click 'Tap to speak into microphone' above or type your answer directly here..."
                          : "Type your answer here..."
                    }
                    className="w-full p-3 sm:p-3.5 rounded-xl bg-white border border-[#3a2318]/20 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none shadow-xs leading-relaxed"
                  />

                  {/* Real-time live interim spoken phrase indicator */}
                  {interimTranscript && (
                    <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300/60 text-emerald-900 text-xs italic flex items-center gap-1.5 animate-in fade-in">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                      <span className="font-medium not-italic text-[11px] text-emerald-800">Hearing:</span>
                      <span className="truncate">"{interimTranscript}"</span>
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
                      placeholder={
                        isRecordingVoice
                          ? "Transcribing your follow-up answer live..."
                          : "Speak or type your follow-up answer addressing the AI's question..."
                      }
                      className="w-full p-3 sm:p-3.5 rounded-xl bg-white border border-[#b4532a]/40 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none shadow-xs leading-relaxed"
                    />

                    {interimTranscript && (
                      <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300/60 text-emerald-900 text-xs italic flex items-center gap-1.5 animate-in fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                        <span className="font-medium not-italic text-[11px] text-emerald-800">Hearing:</span>
                        <span className="truncate">"{interimTranscript}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Answer Submit Controls */}
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#3a2318]/15 flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono text-[#3a2318]/60">
                {!hasAskedFollowUp 
                  ? `${userAnswerText.trim().split(/\s+/).filter(Boolean).length} words` 
                  : `${userFollowUpAnswerText.trim().split(/\s+/).filter(Boolean).length} words`}
              </span>

              {!hasAskedFollowUp ? (
                <button
                  type="button"
                  onClick={handleSubmitPrimaryAnswer}
                  disabled={!userAnswerText.trim() && !interimTranscript.trim()}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] disabled:opacity-40 text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>Submit Answer</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteQuestion}
                  disabled={!userFollowUpAnswerText.trim() && !interimTranscript.trim()}
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#5b8076] hover:bg-[#47655d] disabled:opacity-40 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Complete Interview'}</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 3. Bottom Controls Floating Dock */}
      <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <footer className="flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#faf0d8]/95 backdrop-blur-md border border-[#3a2318]/20 shadow-lg text-xs font-sans">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium text-xs shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium text-xs shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
              !isCameraActive
                ? 'bg-red-100 border-red-300 text-red-800'
                : 'bg-[#f0e3c5] hover:bg-[#e7d8b5] border-[#3a2318]/15 text-[#2a170f]'
            }`}
          >
            {isCameraActive ? <Camera className="w-3.5 h-3.5 text-emerald-700" /> : <CameraOff className="w-3.5 h-3.5 text-red-600" />}
            <span className="hidden sm:inline">{isCameraActive ? 'Camera On' : 'Camera Off'}</span>
          </button>

          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium text-xs shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
              showCaptions
                ? 'bg-[#b4532a]/15 border-[#b4532a]/40 text-[#b4532a]'
                : 'bg-[#f0e3c5] hover:bg-[#e7d8b5] border-[#3a2318]/15 text-[#2a170f]/75'
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>

          <div className="w-px h-4 bg-[#3a2318]/15 mx-1 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[#3a2318]/70">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Encrypted Room v2.4</span>
          </div>
        </footer>
      </div>

      {/* PAUSE MODAL (Mobile Responsive) */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
          <div className="rounded-3xl bg-[#faf4e6] border border-[#3a2318]/20 p-5 sm:p-7 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl text-center text-[#2a170f] animate-modal-pop">
            <div className="w-12 h-12 rounded-full bg-[#dfa84c]/20 text-[#8d3e1b] flex items-center justify-center mx-auto mb-3 animate-subtle-float">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2a170f] font-semibold mb-1">Interview Paused</h3>
            <p className="text-xs text-[#3a2318]/75 font-sans mb-6">
              Your timer is frozen and responses are preserved. Take a breath, grab water, and resume whenever you're ready.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setIsPauseModalOpen(false)}
                className="w-full py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Interview</span>
              </button>
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  exitToDashboard();
                }}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#f0e3c5] text-[#2a170f]/80 text-xs font-medium transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* END ROUND CONFIRMATION MODAL (Mobile Responsive) */}
      {isEndModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
          <div className="rounded-3xl bg-[#faf4e6] border border-red-200 p-5 sm:p-7 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl text-center text-[#2a170f] animate-modal-pop">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3 animate-subtle-float">
              <StopCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#2a170f] font-semibold mb-1">Conclude Interview Round?</h3>
            <p className="text-xs text-[#3a2318]/75 font-sans mb-4">
              You have completed {currentQuestionIndex + (userAnswerText ? 1 : 0)} of {questions.length} questions. Ending now will analyze your submitted answers and generate your full AI performance report.
            </p>
            
            <div className="p-3 rounded-xl bg-[#f5ecda] border border-[#3a2318]/15 text-left text-xs mb-5 space-y-1.5 font-mono text-[#2a170f]">
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
                  let finalTurns = [...turns];
                  if (userAnswerText.trim() || interimTranscript.trim()) {
                    const currentTurn: UserTurn = {
                      questionId: activeQuestion.id,
                      questionText: activeQuestion.question,
                      userAnswerText: (userAnswerText + (interimTranscript ? ' ' + interimTranscript : '')).trim(),
                      audioDurationSeconds: Math.floor(elapsedSeconds),
                      answeredAt: new Date().toLocaleTimeString(),
                      followUpText: activeFollowUpText || undefined,
                      userFollowUpAnswerText: userFollowUpAnswerText.trim() || undefined
                    };
                    addTurn(currentTurn);
                    finalTurns = [...finalTurns, currentTurn];
                  }
                  finishInterview(finalTurns);
                }}
                className="w-full py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>End & Generate AI Report</span>
              </button>

              <button
                onClick={() => setIsEndModalOpen(false)}
                className="w-full py-2.5 rounded-full bg-transparent hover:bg-[#f0e3c5] text-[#2a170f]/80 text-xs font-medium transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.98]"
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
