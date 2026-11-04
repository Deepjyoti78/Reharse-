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

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-0 animate-fade-in-up">
      {/* Soft spotlight behind heading and subtext to dissolve outer grid */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-[#f3e7c9] blur-2xl opacity-95 pointer-events-none rounded-full z-0" />

      {/* Header (shifted higher up) */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-3 sm:mb-3.5">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2a170f] font-normal leading-tight">
          Configure your <em className="italic text-[#b4532a]">interview settings.</em>
        </h2>
        <p className="mt-1 text-xs sm:text-[13px] text-[#3a2318]/75 font-sans">
          Tailor target role, difficulty, duration, and AI behavior inside this single unified workspace.
        </p>
      </div>

      {/* Unified Master Card (All controls consolidated, Non-Scrollable) */}
      <div className="relative z-10 rounded-3xl bg-[#faf3e3] border border-[#3a2318]/15 shadow-md p-4 sm:p-5 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          
          {/* ============ Column 1: Role, Experience & Difficulty ============ */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Target Job Role */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2a170f] font-sans">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#b4532a]" />
                  <span>Target Role</span>
                </div>
                <span className="text-[10px] font-mono text-[#3a2318]/50 uppercase">Current: {config.jobRole}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {STANDARD_ROLES.slice(0, 5).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
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
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    isCustomRole
                      ? 'bg-[#b4532a] text-[#fdfaf3] shadow-xs'
                      : 'bg-[#f0e4c6] text-[#2a170f] hover:bg-[#e6d6b2]'
                  }`}
                >
                  + Custom
                </button>
              </div>

              {isCustomRole && (
                <div className="mt-2 animate-fade-in-up">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={handleCustomRoleChange}
                    placeholder="Enter custom title (e.g. SRE, AI Architect)"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#3a2318]/20 text-xs text-[#2a170f] focus:outline-none focus:border-[#b4532a]"
                  />
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-[#2a170f] font-sans">
                <GraduationCap className="w-3.5 h-3.5 text-[#5b8076]" />
                <span>Experience Level</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {EXPERIENCE_LEVELS.map(level => {
                  const isSelected = config.experienceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateConfig({ experienceLevel: level })}
                      className={`py-1.5 px-1 rounded-lg text-center text-[11px] font-medium transition-all border ${
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

            {/* Interview Difficulty (4 Compact Grid Tiles) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2a170f] font-sans">
                  <Flame className="w-3.5 h-3.5 text-[#b4532a]" />
                  <span>Interview Difficulty</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#b4532a]">
                  <Zap className="w-3 h-3" />
                  <span>Adaptive Enabled</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DIFFICULTIES.map(diff => {
                  const isSelected = config.difficulty === diff.value;
                  return (
                    <div
                      key={diff.value}
                      onClick={() => updateConfig({ difficulty: diff.value })}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#faf0d7] border-[#b4532a] ring-1 ring-[#b4532a]/40 shadow-xs'
                          : 'bg-[#f7edd7] border-[#3a2318]/15 hover:border-[#3a2318]/30 hover:bg-[#f3e5ca]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-serif text-sm text-[#2a170f] font-normal">{diff.label}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#b4532a] text-[#fdfaf3]' : 'bg-[#3a2318]/10 text-[#3a2318]/70'
                        }`}>
                          {diff.badge}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-[#3a2318]/70 leading-tight font-sans line-clamp-1">
                        {diff.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ============ Column 2: Duration, Style & Disposition ============ */}
          <div className="lg:col-span-6 space-y-3.5">
            {/* Duration & Questions Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Duration */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-[#2a170f] font-sans">
                  <Clock className="w-3.5 h-3.5 text-[#dfa84c]" />
                  <span>Duration</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {DURATIONS.slice(0, 3).map(dur => {
                    const isSelected = config.durationMinutes === dur.value;
                    return (
                      <button
                        key={dur.value}
                        type="button"
                        onClick={() => updateConfig({ durationMinutes: dur.value })}
                        className={`py-1.5 px-1 text-center rounded-lg text-[10.5px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#3a2318] text-[#f8eed8]'
                            : 'bg-[#f2e6cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                        }`}
                      >
                        {dur.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-[#2a170f] font-sans">
                  <HelpCircle className="w-3.5 h-3.5 text-[#b4532a]" />
                  <span>Question Count</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
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
                        className={`py-1.5 px-1 text-center rounded-lg text-[10.5px] font-medium transition-all ${
                          isSelected
                            ? 'bg-[#3a2318] text-[#f8eed8]'
                            : 'bg-[#f2e6cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interview Style */}
            <div>
              <div className="text-xs font-semibold text-[#2a170f] font-sans mb-1.5">
                Interview Cadence
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(st => {
                  const isSelected = config.interviewStyle === st.value;
                  return (
                    <div
                      key={st.value}
                      onClick={() => updateConfig({ interviewStyle: st.value })}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#faf0d7] border-[#b4532a]'
                          : 'bg-[#f7edd7] border-[#3a2318]/15 hover:bg-[#f3e5ca]'
                      }`}
                    >
                      <div className="text-[11px] font-semibold text-[#2a170f]">{st.label}</div>
                      <div className="text-[10px] text-[#3a2318]/70 mt-0.5 line-clamp-1">{st.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Spoken Language & AI Disposition Dropdown */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#2a170f] font-sans mb-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-[#5b8076]" />
                  <span>Language</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {LANGUAGES.slice(0, 3).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => updateConfig({ language: lang })}
                      className={`px-2 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
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

              <div>
                <div className="text-xs font-semibold text-[#2a170f] font-sans mb-1.5">
                  AI Disposition
                </div>
                <select
                  value={config.aiTone}
                  onChange={(e) => updateConfig({ aiTone: e.target.value as AIBehaviorTone })}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-[#3a2318]/20 text-[11px] text-[#2a170f] focus:outline-none focus:border-[#b4532a]"
                >
                  {AI_TONES.map(tone => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Blueprint Summary Banner */}
            <div className="p-2.5 rounded-xl bg-[#f0e4c8]/70 border border-[#3a2318]/10 flex items-center justify-between text-xs text-[#2a170f]">
              <span className="font-mono text-[10.5px] text-[#3a2318]/60 uppercase">Session Blueprint:</span>
              <span className="font-medium text-[11px] text-[#b4532a]">
                {config.jobRole} • {config.experienceLevel} • {config.difficulty} • {config.durationMinutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar inside Master Card */}
        <div className="mt-5 pt-3.5 border-t border-[#3a2318]/10 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStage('type-selection')}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/20 transition-all cursor-pointer group"
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Continue to Personalization</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
