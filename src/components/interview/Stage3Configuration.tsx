import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  HelpCircle, 
  Clock, 
  Globe2, 
  GraduationCap, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import type { 
  JobRole, 
  ExperienceLevel, 
  InterviewDifficulty, 
  InterviewDurationMinutes, 
  InterviewStyle, 
  InterviewLanguage, 
  AIBehaviorTone 
} from '../../types/interview';

const STANDARD_ROLES: JobRole[] = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Development Engineer',
  'Data Analyst',
  'Machine Learning Engineer',
  'UI/UX Designer'
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Fresher',
  '0–1 Years',
  '1–3 Years',
  '3–5 Years',
  '5+ Years'
];

interface DifficultyOption {
  value: InterviewDifficulty;
  label: string;
  badge: string;
  description: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  {
    value: 'Easy',
    label: 'Easy',
    badge: 'Foundational',
    description: 'Straightforward concepts, standard syntax questions, and encouraging follow-ups.'
  },
  {
    value: 'Medium',
    label: 'Medium',
    badge: 'Standard Industry',
    description: 'Realistic interview bar with edge-case exploration and architectural trade-offs.'
  },
  {
    value: 'Hard',
    label: 'Hard',
    badge: 'Bar Raiser',
    description: 'Relentless deep-dives, distributed failure modes, and tight constraint justification.'
  },
  {
    value: 'Adaptive Difficulty',
    label: 'Adaptive Difficulty',
    badge: 'AI Dynamic',
    description: 'Dynamically scales up when you excel and offers scaffolding hints if you stumble.'
  }
];

const DURATIONS: { value: InterviewDurationMinutes; label: string; desc: string }[] = [
  { value: 10, label: '10 Min', desc: 'Lightning warm-up' },
  { value: 15, label: '15 Min', desc: 'Quick check' },
  { value: 30, label: '30 Min', desc: 'Standard round' },
  { value: 45, label: '45 Min', desc: 'Full deep-dive' },
  { value: 60, label: '60 Min', desc: 'Comprehensive loop' }
];

const QUESTION_COUNTS = [5, 10, 15];

const STYLES: { value: InterviewStyle; label: string; description: string }[] = [
  {
    value: 'Conversational Interview',
    label: 'Conversational Interview',
    description: 'Natural organic back-and-forth flow where the AI responds to your points and asks intuitive follow-ups.'
  },
  {
    value: 'Question-by-Question Interview',
    label: 'Question-by-Question',
    description: 'Structured sequential cadence with distinct timers per question, ideal for strict panel simulation.'
  }
];

const LANGUAGES: InterviewLanguage[] = ['English', 'Hindi', 'Spanish', 'French', 'German'];

const AI_TONES: { value: AIBehaviorTone; label: string; description: string }[] = [
  {
    value: 'Friendly and supportive',
    label: 'Friendly & Supportive',
    description: 'Warm, patient, eases tension, and guides you if you lose your train of thought.'
  },
  {
    value: 'Professional and formal',
    label: 'Professional & Formal',
    description: 'Polished, structured corporate tone mirroring standard senior panel interviews.'
  },
  {
    value: 'Strict and challenging',
    label: 'Strict & Challenging',
    description: 'Direct pushback, questions hand-wavy claims, and demands concrete proof.'
  },
  {
    value: 'Technical expert',
    label: 'Technical Expert',
    description: 'Focuses strictly on low-level primitives, runtime memory, and performance nuances.'
  }
];

export const Stage3Configuration: React.FC = () => {
  const { config, updateConfig, setCurrentStage } = useInterview();
  const [isCustomRole, setIsCustomRole] = useState(
    !STANDARD_ROLES.includes(config.jobRole)
  );
  const [customRoleInput, setCustomRoleInput] = useState(
    !STANDARD_ROLES.includes(config.jobRole) ? config.jobRole : ''
  );
  const [customQuestionsInput, setCustomQuestionsInput] = useState('');
  const [isCustomQuestions, setIsCustomQuestions] = useState(
    !QUESTION_COUNTS.includes(typeof config.questionCount === 'number' ? config.questionCount : 5)
  );

  const handleRoleSelect = (role: JobRole) => {
    setIsCustomRole(false);
    updateConfig({ jobRole: role });
  };

  const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomRoleInput(val);
    updateConfig({ jobRole: val || 'Custom Role' });
  };

  const handleCustomQuestionCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCustomQuestionsInput(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 30) {
      updateConfig({ questionCount: val });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Configure your <em className="italic text-[#b4532a]">interview settings.</em>
        </h2>
        <p className="mt-2 text-sm text-[#3a2318]/75 font-sans">
          Tailor the target role, difficulty, duration, and AI behavior to match the real-world company you’re targeting.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Job Role Card */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-[#b4532a]" />
            <h3 className="font-serif text-xl text-[#2a170f]">Target Job Role</h3>
          </div>
          <p className="text-xs text-[#3a2318]/70 font-sans mb-4">
            Select one of the calibrated roles or enter a custom title (e.g., iOS Engineer, DevOps Specialist).
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {STANDARD_ROLES.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  !isCustomRole && config.jobRole === role
                    ? 'bg-[#b4532a] text-[#fdfaf3] shadow-xs'
                    : 'bg-[#f0e4c6] text-[#2a170f] hover:bg-[#e6d6b2]'
                }`}
              >
                {role}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsCustomRole(true);
                if (customRoleInput) updateConfig({ jobRole: customRoleInput });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                isCustomRole
                  ? 'bg-[#b4532a] text-[#fdfaf3] shadow-xs'
                  : 'bg-[#f0e4c6] text-[#2a170f] hover:bg-[#e6d6b2]'
              }`}
            >
              + Custom Role
            </button>
          </div>

          {isCustomRole && (
            <div className="mt-3 pt-3 border-t border-[#3a2318]/10 animate-in fade-in duration-200">
              <label className="block text-[11px] uppercase font-mono text-[#3a2318]/70 mb-1.5">
                Enter your exact target position
              </label>
              <input
                type="text"
                value={customRoleInput}
                onChange={handleCustomRoleChange}
                placeholder="e.g. Senior Site Reliability Engineer or Product Manager"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#3a2318]/20 text-sm text-[#2a170f] focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a]"
              />
            </div>
          )}
        </div>

        {/* 2. Experience Level */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-4 h-4 text-[#5b8076]" />
            <h3 className="font-serif text-xl text-[#2a170f]">Experience Level</h3>
          </div>
          <p className="text-xs text-[#3a2318]/70 font-sans mb-4">
            Sets the depth of expected leadership, scale architecture, and domain maturity.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {EXPERIENCE_LEVELS.map(level => {
              const isSelected = config.experienceLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateConfig({ experienceLevel: level })}
                  className={`py-2.5 px-3 rounded-xl text-center text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-[#3a2318] text-[#f8eed8] border-[#3a2318] shadow-xs'
                      : 'bg-[#f5ebd2] text-[#3a2318] border-transparent hover:bg-[#ebdaba]'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Interview Difficulty (with Adaptive Highlight) */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#b4532a]" />
              <h3 className="font-serif text-xl text-[#2a170f]">Interview Difficulty</h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#b4532a]">
              <Zap className="w-3 h-3" />
              <span>Adaptive Engine Available</span>
            </div>
          </div>
          <p className="text-xs text-[#3a2318]/70 font-sans mb-4">
            Calibrates how intensely the AI challenges your initial answers and drills into edge cases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DIFFICULTIES.map(diff => {
              const isSelected = config.difficulty === diff.value;
              return (
                <div
                  key={diff.value}
                  onClick={() => updateConfig({ difficulty: diff.value })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#faf0d7] border-[#b4532a] ring-1 ring-[#b4532a]/40 shadow-xs'
                      : 'bg-[#f7edd7] border-[#3a2318]/15 hover:border-[#3a2318]/30 hover:bg-[#f3e5ca]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-lg text-[#2a170f] font-normal">{diff.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#b4532a] text-[#fdfaf3]' : 'bg-[#3a2318]/10 text-[#3a2318]/70'
                    }`}>
                      {diff.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#3a2318]/75 leading-relaxed font-sans">
                    {diff.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Duration & Question Count Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[#dfa84c]" />
              <h3 className="font-serif text-lg text-[#2a170f]">Interview Duration</h3>
            </div>
            <p className="text-xs text-[#3a2318]/70 font-sans mb-3">
              Allocates session time across questions and debrief.
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {DURATIONS.map(dur => {
                const isSelected = config.durationMinutes === dur.value;
                return (
                  <button
                    key={dur.value}
                    type="button"
                    onClick={() => updateConfig({ durationMinutes: dur.value })}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#3a2318] text-[#f8eed8]'
                        : 'bg-[#f2e6cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                    }`}
                  >
                    <div>{dur.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-[#b4532a]" />
              <h3 className="font-serif text-lg text-[#2a170f]">Number of Questions</h3>
            </div>
            <p className="text-xs text-[#3a2318]/70 font-sans mb-3">
              How many primary questions you’ll be evaluated on.
            </p>
            <div className="flex gap-2">
              {QUESTION_COUNTS.map(cnt => {
                const isSelected = !isCustomQuestions && config.questionCount === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setIsCustomQuestions(false);
                      updateConfig({ questionCount: cnt });
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#3a2318] text-[#f8eed8]'
                        : 'bg-[#f2e6cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsCustomQuestions(true)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  isCustomQuestions
                    ? 'bg-[#3a2318] text-[#f8eed8]'
                    : 'bg-[#f2e6cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                }`}
              >
                Custom
              </button>
            </div>
            {isCustomQuestions && (
              <div className="mt-2.5">
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={customQuestionsInput}
                  onChange={handleCustomQuestionCount}
                  placeholder="Enter count (1 - 25)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#3a2318]/20 text-xs text-[#2a170f]"
                />
              </div>
            )}
          </div>
        </div>

        {/* 5. Interview Style & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Style */}
          <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 shadow-xs">
            <h3 className="font-serif text-lg text-[#2a170f] mb-1">Interview Flow Style</h3>
            <p className="text-xs text-[#3a2318]/70 font-sans mb-3">
              Conversational vs. strict question timer mode.
            </p>
            <div className="space-y-2">
              {STYLES.map(st => {
                const isSelected = config.interviewStyle === st.value;
                return (
                  <div
                    key={st.value}
                    onClick={() => updateConfig({ interviewStyle: st.value })}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#faf0d7] border-[#b4532a]'
                        : 'bg-[#f7edd7] border-[#3a2318]/15 hover:bg-[#f3e5ca]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#2a170f]">{st.label}</div>
                    <div className="text-[11px] text-[#3a2318]/75 mt-0.5">{st.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Language & Tone */}
          <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe2 className="w-4 h-4 text-[#5b8076]" />
                <h3 className="font-serif text-lg text-[#2a170f]">Spoken Language</h3>
              </div>
              <p className="text-xs text-[#3a2318]/70 font-sans mb-3">
                AI interviewer dialogue and transcription dialect.
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => updateConfig({ language: lang })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      config.language === lang
                        ? 'bg-[#5b8076] text-white shadow-xs'
                        : 'bg-[#f0e3c5] text-[#2a170f] hover:bg-[#e4d4b1]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#3a2318]/10">
              <div className="text-xs font-medium text-[#2a170f] mb-1.5">
                AI Interviewer Disposition
              </div>
              <select
                value={config.aiTone}
                onChange={(e) => updateConfig({ aiTone: e.target.value as AIBehaviorTone })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#3a2318]/20 text-xs text-[#2a170f] focus:outline-none focus:border-[#b4532a]"
              >
                {AI_TONES.map(tone => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label} — {tone.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentStage('type-selection')}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
          <span>Back to Track Selection</span>
        </button>

        <button
          onClick={() => {
            setCurrentStage('personalization');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Continue to Personalization</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
