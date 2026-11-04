import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Target, ShieldCheck, Cpu, Award } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const Stage1Intro: React.FC = () => {
  const { setCurrentStage, exitToDashboard, config, updateConfig } = useInterview();

  const handleSelectQuickRole = (role: string) => {
    updateConfig({ jobRole: role });
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-6 py-2 sm:py-4 animate-fade-in-up">
      {/* Main Hero Card with Warm Parchment Palette & Generous Spacing */}
      <div className="relative rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 shadow-md p-4 sm:p-8 md:p-10 transition-shadow hover:shadow-lg">
        
        {/* Top Header inside Card with Back to Overview Button */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5 sm:mb-8">
          <button
            onClick={exitToDashboard}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#f0e4c8] hover:bg-[#e6d8ba] text-[#2a170f] text-xs sm:text-[13px] font-medium font-sans border border-[#3a2318]/15 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
            <span>Back to overview</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#b4532a]/10 border border-[#b4532a]/20 text-[#b4532a] text-[11px] sm:text-xs font-sans font-medium tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#b4532a] animate-subtle-float" />
            <span>Personalized AI Setup</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[42px] leading-[1.15] text-[#2a170f] font-normal mb-3 sm:mb-4">
              Let's prepare for your <br />
              <em className="italic text-[#b4532a]">next interview.</em>
            </h1>

            <p className="text-xs sm:text-[15px] text-[#3a2318]/80 leading-relaxed font-sans mb-5 sm:mb-7 max-w-xl">
              You are about to configure a custom simulated interview. In the next few steps, you'll pick your interview track, adjust the difficulty and tone, optionally upload your resume for tailored questions, test your microphone, and step into an authentic live session.
            </p>

            {/* Quick Role Pickers */}
            <div className="mb-5 sm:mb-7">
              <div className="text-[11px] uppercase tracking-wider text-[#3a2318]/65 font-mono mb-2.5">
                Quick select target role:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Frontend Developer',
                  'Backend Developer',
                  'Software Development Engineer',
                  'Data Analyst',
                  'UI/UX Designer'
                ].map((role, idx) => {
                  const isSelected = config.jobRole === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelectQuickRole(role)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer border hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#2a170f] text-[#f8eed8] border-[#2a170f] shadow-xs'
                          : 'bg-[#f0e4c8]/85 text-[#2a170f] border-[#3a2318]/15 hover:bg-[#e6d8ba] hover:border-[#3a2318]/30'
                      }`}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  setCurrentStage('type-selection');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] font-sans text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Choose Interview Type</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={exitToDashboard}
                className="px-5 py-2.5 sm:py-3 rounded-full bg-transparent hover:bg-[#3a2318]/8 text-[#3a2318] font-sans text-xs sm:text-sm font-medium transition-all cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99]"
              >
                Cancel & return
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[260px] sm:max-w-[300px] rounded-2xl overflow-hidden border border-[#3a2318]/20 shadow-md bg-[#eddcc0]">
              <img
                src="/images/rehearse/practice/candidate-preparation.webp"
                alt="Candidate preparing for interview with notes and vintage study lamp"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/90 via-[#2a170f]/30 to-transparent flex flex-col justify-end p-4 text-[#f8eed8]">
                <div className="font-serif text-base sm:text-lg leading-tight">Authentic conversational depth</div>
                <div className="text-[11px] sm:text-xs text-[#f8eed8]/80 mt-1 font-sans">
                  Adaptive AI that pushes back on weak assumptions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars footer */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#3a2318]/10 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-xs font-sans text-[#3a2318]/85">
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f0e4c8]/60 hover:bg-[#f0e4c8]/90 border border-[#3a2318]/10 transition-colors">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b4532a] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">Role-tailored banks</span>
          </div>
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f0e4c8]/60 hover:bg-[#f0e4c8]/90 border border-[#3a2318]/10 transition-colors">
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5b8076] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">Live voice & transcript</span>
          </div>
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f0e4c8]/60 hover:bg-[#f0e4c8]/90 border border-[#3a2318]/10 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#b4532a] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">Private & encrypted</span>
          </div>
          <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-[#f0e4c8]/60 hover:bg-[#f0e4c8]/90 border border-[#3a2318]/10 transition-colors">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dfa84c] shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs">STAR rubrics & debrief</span>
          </div>
        </div>
      </div>
    </div>
  );
};
