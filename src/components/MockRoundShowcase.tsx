import React, { useState } from 'react';
import { ArrowRight, Check, Play, Pause, RefreshCw, Sparkles } from 'lucide-react';

interface MockRoundShowcaseProps {
  onOpenDemo: () => void;
}

export const MockRoundShowcase: React.FC<MockRoundShowcaseProps> = ({ onOpenDemo }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "AI Question",
      speaker: "Rehearse AI Interviewer",
      text: "“Can you walk me through a time when a technical decision you championed caused an unexpected regression? How did you triage it?”",
      tag: "Target: Critical thinking & accountability",
      img: "/images/rehearse/practice/interview-in-progress.webp",
      alt: "Candidate interacting with robot interviewer across mahogany desk"
    },
    {
      label: "Candidate Answer",
      speaker: "You (Candidate)",
      text: "“In Q3, I migrated our indexing pipeline to Kafka. While throughput doubled, lag spiked during peak ingestion because partitions were misconfigured. I paused non-critical consumer groups, rebalanced the partitions, and added automated backpressure alerts.”",
      tag: "STAR Structure: High clarity",
      img: "/images/rehearse/interview/vintage-microphone-waves.webp",
      alt: "Vintage microphone capturing spoken response with acoustic waves"
    },
    {
      label: "Live AI Debrief",
      speaker: "Real-time Scoring",
      text: "Score: 92/100 • Strong ownership and concrete mitigation steps. Next round suggestion: quantify the downtime duration and business impact.",
      tag: "Actionable Feedback",
      img: "/images/rehearse/feedback/session-debrief-scorecard.webp",
      alt: "Session debrief scorecard with line-by-line critique"
    }
  ];

  return (
    <section id="practice" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-16 bg-[#a9b5a0] text-[#2a1a12] border-b border-[#3a2318]/15">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#3a2318] bg-[#f3e7c9]/70 px-3.5 py-1 rounded-full border border-[#3a2318]/15">
              Live Practice Mode
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#2a1a12] mt-3 tracking-tight">
              Your first mock round
            </h2>
          </div>
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#3a2318] text-[#3a2318] hover:bg-[#3a2318] hover:text-[#f3e7c9] transition-all text-sm font-medium shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b4532a]" />
            <span>Try interactive demo</span>
          </button>
        </div>

        {/* Feature Showcase Card */}
        <div className="bg-[#f3e7c9] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl border border-[#3a2318]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Primary Editorial Artwork + Interactive Simulation */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Main Visual Image Container */}
            <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden shadow-md border border-[#3a2318]/15 bg-[#3a2318]">
              <img
                src={steps[currentStep].img}
                alt={steps[currentStep].alt}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
              />

              {/* Step Badge */}
              <div className="absolute top-3.5 left-3.5 bg-[#3a2318]/85 backdrop-blur-md text-[#f3e7c9] px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-[#f3e7c9]/20 shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#e0b25c] animate-pulse" />
                <span>Phase {currentStep + 1}: {steps[currentStep].label}</span>
              </div>

              {/* Floating Audio Playback Pill */}
              <div className="absolute bottom-3.5 right-3.5 bg-[#2a1a12]/90 backdrop-blur-md text-[#f3e7c9] px-3.5 py-1.5 rounded-full flex items-center gap-2.5 border border-[#e0b25c]/40 shadow-lg">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-6 h-6 rounded-full bg-[#e0b25c] text-[#2a1a12] flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Toggle audio playback"
                >
                  {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                </button>
                <div className="flex items-center gap-1 h-3.5">
                  {[35, 75, 95, 60, 40, 85, 50, 100, 70, 45].map((h, i) => (
                    <span
                      key={i}
                      className={`w-0.5 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-[#e0b25c] animate-pulse' : 'bg-[#f3e7c9]/40'
                      }`}
                      style={{ height: `${h}%`, animationDelay: `${i * 70}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Transcript Snippet */}
            <div className="p-4 rounded-xl bg-[#e8dcbf] border border-[#3a2318]/15">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-[#b4532a]">
                  {steps[currentStep].speaker}
                </span>
                <span className="text-[10px] font-mono text-[#3a2318]/70 bg-[#f3e7c9] px-2 py-0.5 rounded">
                  {steps[currentStep].tag}
                </span>
              </div>
              <p className="font-serif italic text-sm sm:text-base text-[#2a1a12] leading-snug">
                {steps[currentStep].text}
              </p>

              {/* Step Navigation Pill Buttons */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#3a2318]/10 text-xs">
                <div className="flex items-center gap-1.5">
                  {steps.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentStep(i)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                        currentStep === i
                          ? 'bg-[#3a2318] text-[#f3e7c9] font-semibold'
                          : 'bg-[#f3e7c9] text-[#3a2318] hover:bg-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep((currentStep + 1) % steps.length)}
                  className="text-[#b4532a] hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>Next</span>
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2a1a12] leading-[1.05]">
              Sit across from a <br />
              patient interviewer
            </h3>

            <p className="text-[#3a2318]/85 text-base leading-relaxed">
              Choose a role and target seniority. Answer using voice or text, experience real-time follow-ups that challenge vague assertions, and conclude each round with an actionable written debrief.
            </p>

            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#b4532a] text-[#f3e7c9] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm sm:text-base text-[#2a1a12]">
                  <strong className="font-semibold text-[#3a2318]">Tailored questions</strong> extracted from your actual projects and targeted job requirements.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#b4532a] text-[#f3e7c9] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm sm:text-base text-[#2a1a12]">
                  <strong className="font-semibold text-[#3a2318]">Adaptive follow-ups</strong> that naturally probe vague metrics and hand-waving claims.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#b4532a] text-[#f3e7c9] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm sm:text-base text-[#2a1a12]">
                  <strong className="font-semibold text-[#3a2318]">Progress trajectory</strong> tracking your composure, clarity, and depth over every session.
                </span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenDemo}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#3a2318] text-[#f3e7c9] hover:bg-[#26150e] hover:shadow-lg transition-all text-sm font-medium tracking-wide"
              >
                <span>Begin a session</span>
                <ArrowRight className="w-4 h-4 text-[#e0b25c]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
