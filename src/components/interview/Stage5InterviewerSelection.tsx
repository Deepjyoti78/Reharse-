import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AudioWaveform,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { AI_INTERVIEWERS } from '../../data/interviewBank';
import type { AIInterviewerProfile } from '../../types/interview';
import { playElevenLabsSpeech, stopElevenLabsSpeech, isElevenLabsConfigured } from '../../services/elevenlabs';

export const Stage5InterviewerSelection: React.FC = () => {
  const { 
    selectedInterviewer, 
    setSelectedInterviewer, 
    setCurrentStage,
    updateConfig
  } = useInterview();

  const [isPlayingPreview, setIsPlayingPreview] = useState<string | null>(null);
  const [speakingPace, setSpeakingPace] = useState(selectedInterviewer.speakingPace || 1.0);

  useEffect(() => {
    return () => {
      stopElevenLabsSpeech();
    };
  }, []);

  const handlePreviewVoice = (interviewer: AIInterviewerProfile) => {
    if (isPlayingPreview === interviewer.id) {
      stopElevenLabsSpeech();
      setIsPlayingPreview(null);
      return;
    }

    setIsPlayingPreview(interviewer.id);

    const sampleText = `Hello! I'm ${interviewer.name}. I'll be guiding your interview today. I'm looking forward to exploring your problem-solving approaches. Take your time, think through the trade-offs, and speak clearly.`;

    playElevenLabsSpeech({
      text: sampleText,
      voiceId: interviewer.voiceId,
      speakingRate: speakingPace,
      voiceGender: interviewer.voiceGender,
      onStart: () => {
        setIsPlayingPreview(interviewer.id);
      },
      onEnded: () => {
        setIsPlayingPreview(null);
      },
      onError: () => {
        setIsPlayingPreview(null);
      }
    });
  };

  const handleSelect = (interviewer: AIInterviewerProfile) => {
    setSelectedInterviewer({ ...interviewer, speakingPace });
    updateConfig({ interviewer: { ...interviewer, speakingPace } });
  };

  const handlePaceChange = (pace: number) => {
    setSpeakingPace(pace);
    setSelectedInterviewer({ ...selectedInterviewer, speakingPace: pace });
    updateConfig({ interviewer: { ...selectedInterviewer, speakingPace: pace } });
  };

  const handleContinue = () => {
    setCurrentStage('preview');
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative max-w-6xl mx-auto px-2 sm:px-6 py-2 sm:py-4 animate-fade-in-up">
      {/* Header with localized fading grid halo behind heading & subtext */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div 
          className="absolute -inset-x-16 -inset-y-6 rounded-full pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, #f3e7c9 50%, rgba(243, 231, 201, 0) 100%)',
            filter: 'blur(16px)',
          }}
        />
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Choose your <em className="italic text-[#b4532a]">AI interviewer.</em>
        </h2>
        <p className="mt-2 text-sm sm:text-[15px] text-[#3a2318]/80 font-sans max-w-xl mx-auto leading-relaxed">
          Select the conversational partner that matches the interview dynamic you wish to rehearse against.
        </p>
      </div>

      {/* Grid of Interviewers */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-6">
        {AI_INTERVIEWERS.map((interviewer, idx) => {
          const isSelected = selectedInterviewer.id === interviewer.id;
          const isPlaying = isPlayingPreview === interviewer.id;
          const staggerClass = `stagger-${Math.min(idx + 1, 8)}`;

          return (
            <div
              key={interviewer.id}
              onClick={() => handleSelect(interviewer)}
              className={`relative rounded-3xl p-4 sm:p-6 transition-all duration-300 cursor-pointer border flex flex-col justify-between interactive-card animate-fade-in-up ${staggerClass} ${
                isSelected
                  ? 'bg-[#f7e9c9] border-[#b4532a] shadow-lg ring-2 ring-[#b4532a]/35 -translate-y-0.5'
                  : 'bg-[#faf0d8] border-[#3a2318]/15 hover:border-[#3a2318]/40 hover:bg-[#f5e7c8]'
              }`}
            >
              <div>
                {/* Header row with portrait & badges */}
                <div className="flex items-start gap-4 mb-3.5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#3a2318]/20 shrink-0 bg-[#eddcc0] shadow-xs">
                    <img
                      src={interviewer.portraitUrl}
                      alt={interviewer.name}
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-[#b4532a]/80 flex items-center justify-center text-white backdrop-blur-xs">
                        <AudioWaveform className="w-6 h-6 animate-pulse" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-2xl text-[#2a170f] leading-tight font-normal">
                        {interviewer.name}
                      </h3>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4532a] text-[#fbf7ee] text-xs font-medium font-sans shadow-xs animate-scale-in">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-[#3a2318]/50 uppercase tracking-wider">
                          {interviewer.accent}
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-[13px] font-medium text-[#b4532a] mt-0.5 font-sans">
                      {interviewer.personality}
                    </div>
                    <div className="text-xs text-[#3a2318]/65 font-sans">
                      {interviewer.role}
                    </div>
                  </div>
                </div>

                {/* Bio & style */}
                <p className="text-xs sm:text-[13px] text-[#3a2318]/80 font-sans leading-relaxed mb-3">
                  {interviewer.bio}
                </p>

                <div className="p-3 rounded-xl bg-[#f2e5cb]/70 border border-[#3a2318]/10 text-xs text-[#3a2318]/90 font-sans mb-3.5">
                  <span className="font-semibold text-[#2a170f]">Style: </span>
                  {interviewer.interviewStyle}
                </div>
              </div>

              {/* Bottom bar with voice preview and instant select action */}
              <div className="pt-3.5 border-t border-[#3a2318]/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewVoice(interviewer);
                  }}
                  className={`inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isPlaying
                      ? 'bg-[#b4532a] text-white shadow-xs'
                      : 'bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Playing Sample...' : 'Preview Voice'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#3a2318]/60">
                    {isElevenLabsConfigured() && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-2.5 h-2.5" />
                        Studio
                      </span>
                    )}
                    <span>{interviewer.voiceGender === 'female' ? 'Female timbre' : 'Male timbre'}</span>
                  </div>

                  {/* Immediate 1-click proceed button when card is selected */}
                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinue();
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Next: Summary</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speaking Pace & Preferences Controls with Warmer Palette */}
      <div className="relative z-10 rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-[#5b8076]" />
              <h3 className="font-serif text-lg text-[#2a170f]">Speaking Pace Calibration</h3>
            </div>
            <p className="text-xs text-[#3a2318]/70 font-sans">
              Adjust how rapidly the AI delivers questions and conversational follow-ups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { val: 0.85, label: 'Deliberate (0.85x)' },
              { val: 1.0, label: 'Standard (1.0x)' },
              { val: 1.15, label: 'Brisk (1.15x)' }
            ].map(p => (
            <button
              key={p.val}
              type="button"
              onClick={() => handlePaceChange(p.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                speakingPace === p.val
                  ? 'bg-[#3a2318] text-[#f8eed8] shadow-xs'
                  : 'bg-[#f0e3c5] text-[#3a2318] hover:bg-[#e6d6b2]'
              }`}
            >
              {p.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons (Transparent, No White Background Bar) */}
      <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={() => setCurrentStage('personalization')}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs sm:text-sm font-medium font-sans border border-[#3a2318]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
          <span>Back to Personalization</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#2a170f]">
          <span className="text-[#3a2318]/60">Selected:</span>
          <span className="font-semibold text-[#b4532a]">{selectedInterviewer.name}</span>
          <span className="text-[#3a2318]/40">•</span>
          <span className="text-[#3a2318]/80">{selectedInterviewer.personality}</span>
        </div>

        <button
          onClick={handleContinue}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Next: Review Summary</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
