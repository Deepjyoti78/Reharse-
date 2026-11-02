import React, { useState } from 'react';
import { 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AudioWaveform,
  Sliders
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { AI_INTERVIEWERS } from '../../data/interviewBank';
import type { AIInterviewerProfile } from '../../types/interview';

export const Stage5InterviewerSelection: React.FC = () => {
  const { 
    selectedInterviewer, 
    setSelectedInterviewer, 
    setCurrentStage,
    updateConfig
  } = useInterview();

  const [isPlayingPreview, setIsPlayingPreview] = useState<string | null>(null);
  const [speakingPace, setSpeakingPace] = useState(selectedInterviewer.speakingPace || 1.0);

  const handlePreviewVoice = (interviewer: AIInterviewerProfile) => {
    if (isPlayingPreview === interviewer.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingPreview(null);
      return;
    }

    setIsPlayingPreview(interviewer.id);

    const sampleText = `Hello! I'm ${interviewer.name}. I'll be guiding your interview today. I'm looking forward to exploring your problem-solving approaches. Take your time, think through the trade-offs, and speak clearly.`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.rate = speakingPace;
      utterance.pitch = interviewer.voiceGender === 'female' ? 1.15 : 0.95;

      utterance.onend = () => {
        setIsPlayingPreview(null);
      };
      utterance.onerror = () => {
        setIsPlayingPreview(null);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Audio fallback simulation timer
      setTimeout(() => {
        setIsPlayingPreview(null);
      }, 3500);
    }
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3a2318]/10 text-[#3a2318] text-[11px] font-mono uppercase tracking-wider mb-2.5">
          <span>Stage 05 of 06</span>
          <span className="opacity-40">•</span>
          <span>Interviewer Persona</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Choose your <em className="italic text-[#b4532a]">AI interviewer.</em>
        </h2>
        <p className="mt-2 text-sm text-[#3a2318]/75 font-sans">
          Select the conversational partner that matches the interview dynamic you wish to rehearse against.
        </p>
      </div>

      {/* Grid of Interviewers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {AI_INTERVIEWERS.map((interviewer) => {
          const isSelected = selectedInterviewer.id === interviewer.id;
          const isPlaying = isPlayingPreview === interviewer.id;

          return (
            <div
              key={interviewer.id}
              onClick={() => handleSelect(interviewer)}
              className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#faf1dc] border-[#b4532a] shadow-md ring-2 ring-[#b4532a]/30'
                  : 'bg-[#faf5e8] border-[#3a2318]/15 hover:border-[#3a2318]/40 hover:bg-[#faf3e2]'
              }`}
            >
              <div>
                {/* Header row with portrait & badges */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#3a2318]/20 shrink-0 bg-[#eddcc0]">
                    <img
                      src={interviewer.portraitUrl}
                      alt={interviewer.name}
                      className="w-full h-full object-cover"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-[#b4532a]/70 flex items-center justify-center text-white">
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#b4532a] text-[#fbf7ee] text-[11px] font-medium font-sans">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[#3a2318]/50 uppercase tracking-wider">
                          {interviewer.accent}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-medium text-[#b4532a] mt-0.5 font-sans">
                      {interviewer.personality}
                    </div>
                    <div className="text-[11px] text-[#3a2318]/60 font-sans">
                      {interviewer.role}
                    </div>
                  </div>
                </div>

                {/* Bio & style */}
                <p className="text-xs text-[#3a2318]/80 font-sans leading-relaxed mb-3">
                  {interviewer.bio}
                </p>

                <div className="p-2.5 rounded-xl bg-[#f2e5cb]/70 border border-[#3a2318]/10 text-[11.5px] text-[#3a2318]/90 font-sans mb-3">
                  <span className="font-semibold text-[#2a170f]">Style: </span>
                  {interviewer.interviewStyle}
                </div>
              </div>

              {/* Bottom bar with voice preview */}
              <div className="pt-3 border-t border-[#3a2318]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviewVoice(interviewer);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isPlaying
                      ? 'bg-[#b4532a] text-white shadow-xs'
                      : 'bg-[#ede0c3] hover:bg-[#e4d3af] text-[#2a170f]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Playing Sample...' : 'Preview Voice'}</span>
                </button>

                <div className="text-[11px] font-mono text-[#3a2318]/60">
                  {interviewer.voiceGender === 'female' ? 'Female timbre' : 'Male timbre'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speaking Pace & Preferences Controls */}
      <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 mb-8 shadow-xs">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
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

      {/* Navigation Controls */}
      <div className="pt-6 border-t border-[#3a2318]/15 flex items-center justify-between">
        <button
          onClick={() => setCurrentStage('personalization')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-[#eddcc0] text-[#3a2318] text-xs sm:text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Personalization</span>
        </button>

        <button
          onClick={() => {
            setCurrentStage('preview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-sm group cursor-pointer"
        >
          <span>Review Interview Summary</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
