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
  Flame,
  Sparkles
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import { instantScrollToTop } from '../../utils/scroll';
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
  '0-1 Years',
  '1-3 Years',
  '3-5 Years',
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
          Configure your <em className="italic text-[#b4532a]">interview settings.</em>
        </h2>
        <p className="mt-2 text-sm sm:text-[15px] text-[#3a2318]/80 font-sans max-w-xl mx-auto leading-relaxed">
          Tailor target role, difficulty, duration, and AI behavior inside this single unified workspace.
        </p>
      </div>

      {/* Unified Master Card with Warm Parchment Palette and Stacked Layout */}
      <div className="relative isolate z-10 rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 shadow-md p-5 sm:p-8 md:p-9">
        <div className="space-y-7 sm:space-y-8">
          
          {/* ============ Top Section: Role, Experience & Difficulty ============ */}
          <div className="space-y-6">
            {/* Target Job Role */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <SlidersHorizontal className="w-4 h-4 text-[#b4532a]" />
                  <span>Target Role</span>
                </div>
                <span className="text-[11px] font-mono text-[#3a2318]/60 uppercase">Current: {config.jobRole}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {STANDARD_ROLES.slice(0, 5).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer border ${
                      !isCustomRole && config.jobRole === role
                        ? 'bg-[#b4532a] text-[#fdfaf3] border-[#b4532a] shadow-xs'
                        : 'bg-[#f2e5cb] text-[#2a170f] border-transparent hover:bg-[#e7d8b8]'
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
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer border ${
                    isCustomRole
                      ? 'bg-[#b4532a] text-[#fdfaf3] border-[#b4532a] shadow-xs'
                      : 'bg-[#f2e5cb] text-[#2a170f] border-transparent hover:bg-[#e7d8b8]'
                  }`}
                >
                  + Custom
                </button>
              </div>

              {isCustomRole && (
                <div className="mt-3 animate-fade-in-up">
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={handleCustomRoleChange}
                    placeholder="Enter custom title (e.g. SRE, AI Architect)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f5e9d0] border border-[#3a2318]/20 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/45 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a]/35 focus:bg-[#fbf5e6] transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Experience Level */}
            <div>
              <div className="flex items-center gap-2 mb-2.5 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                <GraduationCap className="w-4 h-4 text-[#5b8076]" />
                <span>Experience Level</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                {EXPERIENCE_LEVELS.map(level => {
                  const isSelected = config.experienceLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => updateConfig({ experienceLevel: level })}
                      className={`py-2 px-1 rounded-xl text-center text-xs sm:text-[13px] font-medium transition-all border cursor-pointer ${
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

            {/* Interview Difficulty (4 Columns when full width) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <Flame className="w-4 h-4 text-[#b4532a]" />
                  <span>Interview Difficulty</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#b4532a]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Adaptive Dynamic</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DIFFICULTIES.map(diff => {
                  const isSelected = config.difficulty === diff.value;
                  return (
                    <div
                      key={diff.value}
                      onClick={() => updateConfig({ difficulty: diff.value })}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#f8ebce] border-[#b4532a] ring-2 ring-[#b4532a]/30 shadow-xs'
                          : 'bg-[#f5e7c8] border-[#3a2318]/15 hover:border-[#3a2318]/30 hover:bg-[#eeddbb]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-base text-[#2a170f] font-normal">{diff.label}</span>
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
          </div>

          {/* Section Divider */}
          <div className="border-t border-[#3a2318]/12" />

          {/* ============ Bottom Section: Duration, Cadence, Language & Tone (Placed Below Left Side) ============ */}
          <div className="space-y-6">
            {/* Duration & Questions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <Clock className="w-4 h-4 text-[#dfa84c]" />
                  <span>Duration</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {DURATIONS.slice(0, 3).map(dur => {
                    const isSelected = config.durationMinutes === dur.value;
                    return (
                      <button
                        key={dur.value}
                        type="button"
                        onClick={() => updateConfig({ durationMinutes: dur.value })}
                        className={`py-2 px-1 text-center rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3a2318] text-[#f8eed8] shadow-xs'
                            : 'bg-[#f2e5cb] text-[#2a170f] hover:bg-[#e7d8b8]'
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
                <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <HelpCircle className="w-4 h-4 text-[#b4532a]" />
                  <span>Question Count</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
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
                        className={`py-2 px-1 text-center rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#3a2318] text-[#f8eed8] shadow-xs'
                            : 'bg-[#f2e5cb] text-[#2a170f] hover:bg-[#e7d8b8]'
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
              <div className="text-xs sm:text-sm font-semibold text-[#2a170f] font-sans mb-2.5">
                Interview Cadence
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {STYLES.map(st => {
                  const isSelected = config.interviewStyle === st.value;
                  return (
                    <div
                      key={st.value}
                      onClick={() => updateConfig({ interviewStyle: st.value })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#f8ebce] border-[#b4532a] ring-2 ring-[#b4532a]/30'
                          : 'bg-[#f5e7c8] border-[#3a2318]/15 hover:bg-[#eeddbb]'
                      }`}
                    >
                      <div className="text-xs sm:text-[13.5px] font-semibold text-[#2a170f] mb-1">{st.label}</div>
                      <div className="text-xs text-[#3a2318]/75 leading-relaxed">{st.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Disposition & Demeanor */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <Sparkles className="w-4 h-4 text-[#b4532a]" />
                  <span>AI Disposition & Demeanor</span>
                </div>
                <span className="text-[11px] font-mono text-[#3a2318]/65 hidden sm:inline">
                  {AI_TONES.find(t => t.value === config.aiTone)?.description}
                </span>
              </div>
              
              {/* 4 Sleek Styled Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {AI_TONES.map(tone => {
                  const isSelected = config.aiTone === tone.value;
                  return (
                    <button
                      key={tone.value}
                      type="button"
                      onClick={() => updateConfig({ aiTone: tone.value })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#3a2318] text-[#f8eed8] border-[#3a2318] shadow-sm ring-2 ring-[#b4532a]/35 -translate-y-0.5'
                          : 'bg-[#f5e7c8] hover:bg-[#eeddbb] text-[#2a170f] border-[#3a2318]/15 hover:border-[#3a2318]/30 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-[13px] font-semibold">{tone.label}</span>
                        <span className={`w-2 h-2 rounded-full transition-all ${isSelected ? 'bg-[#dfa84c]' : 'bg-[#3a2318]/25'}`} />
                      </div>
                      <div className={`text-[11px] leading-tight ${isSelected ? 'text-[#f8eed8]/80' : 'text-[#3a2318]/70'}`}>
                        {tone.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Spoken Language */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                <Globe2 className="w-4 h-4 text-[#5b8076]" />
                <span>Spoken Language:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.slice(0, 3).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => updateConfig({ language: lang })}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      config.language === lang
                        ? 'bg-[#5b8076] text-white shadow-xs'
                        : 'bg-[#f2e5cb] text-[#2a170f] hover:bg-[#e7d8b8]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Blueprint Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-[#ede0c3]/80 border border-[#3a2318]/10 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#2a170f]">
              <span className="font-mono text-[11px] text-[#3a2318]/65 uppercase">Session Blueprint:</span>
              <span className="font-medium text-xs sm:text-[13px] text-[#b4532a]">
                {config.jobRole} • {config.experienceLevel} • {config.difficulty} • {config.durationMinutes}m
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar inside Master Card */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#3a2318]/12 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={() => {
              setCurrentStage('type-selection');
              instantScrollToTop();
            }}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs sm:text-sm font-medium font-sans border border-[#3a2318]/20 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
            <span>Back to Track Selection</span>
          </button>

          <button
            onClick={() => {
              setCurrentStage('personalization');
              instantScrollToTop();
            }}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Continue to Personalization</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
