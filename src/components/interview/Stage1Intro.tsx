import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Target, ShieldCheck, Cpu, Award } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const Stage1Intro: React.FC = () => {
  const { setCurrentStage, exitToDashboard, config, updateConfig } = useInterview();

  const handleSelectQuickRole = (role: string) => {
    updateConfig({ jobRole: role });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-0 sm:pt-1 pb-6 sm:pb-8 animate-fade-in-up">
      {/* Main Hero Card with Warm Editorial Theme (elevated above outer gridded background) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#fcf6ea] via-[#f7ecd6] to-[#eddac0] border border-[#b4532a]/25 shadow-[0_20px_60px_-15px_rgba(58,35,24,0.22),0_4px_16px_rgba(180,83,42,0.1)] overflow-hidden p-5 sm:p-8 md:p-9 transition-all hover:shadow-[0_24px_70px_-15px_rgba(58,35,24,0.26),0_6px_20px_rgba(180,83,42,0.14)]">
        
        {/* Subtle Warm Amber Glow Highlights inside Card Corners */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#b4532a]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#d97706]/8 blur-3xl pointer-events-none" />

        {/* Top Header inside Card with Improved Back to Overview Button */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-7 sm:mb-9">
          <button
            onClick={exitToDashboard}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ebd8be]/90 hover:bg-[#e2c7a5] text-[#2a170f] text-xs font-medium font-sans border border-[#3a2318]/20 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-1" />
            <span>Back to overview</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#b4532a]/12 border border-[#b4532a]/25 text-[#b4532a] text-[11px] font-sans font-medium tracking-wide uppercase backdrop-blur-xs">
            <Sparkles className="w-3 h-3 text-[#b4532a] animate-subtle-float" />
            <span>Personalized AI Mock Interview Setup</span>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] text-[#2a170f] font-normal mb-3.5">
              Let’s prepare for your <br />
              <em className="italic text-[#b4532a]">next interview.</em>
            </h1>

            <p className="text-sm sm:text-[15px] text-[#3a2318]/85 leading-relaxed font-sans mb-7">
              You are about to configure a custom simulated interview. In the next few steps, you’ll pick your interview track, adjust the difficulty and tone, optionally upload your resume for tailored questions, test your microphone, and step into an authentic live session.
            </p>

            {/* Quick Role Pickers */}
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-wider text-[#3a2318]/65 font-mono mb-3">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border hover:scale-[1.03] active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#2a170f] text-[#f8eed8] border-[#2a170f] shadow-xs'
                          : 'bg-[#ebd8be]/75 text-[#2a170f] border-[#3a2318]/15 hover:bg-[#e2c7a5] hover:border-[#3a2318]/30'
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
                onClick={() => setCurrentStage('type-selection')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] font-sans text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Choose Interview Type</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={exitToDashboard}
                className="px-5 py-3 rounded-full bg-transparent hover:bg-[#3a2318]/8 text-[#3a2318] font-sans text-sm font-medium transition-all cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99]"
              >
                Cancel & return
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-[#3a2318]/25 shadow-md bg-[#eddcc0]">
              <img
                src="/images/rehearse/practice/candidate-preparation.webp"
                alt="Candidate preparing for interview with notes and vintage study lamp"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/85 via-transparent to-transparent flex flex-col justify-end p-4 text-[#f8eed8]">
                <div className="font-serif text-lg leading-tight">Authentic conversational depth</div>
                <div className="text-[11px] text-[#f8eed8]/80 mt-0.5 font-sans">
                  Adaptive AI that pushes back on weak assumptions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars footer */}
        <div className="relative z-10 mt-9 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans text-[#3a2318]/85">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ebd8be]/60 hover:bg-[#ebd8be]/90 border border-[#3a2318]/10 transition-colors">
            <Target className="w-4 h-4 text-[#b4532a] shrink-0" />
            <span className="font-medium text-[11.5px]">Role-tailored banks</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ebd8be]/60 hover:bg-[#ebd8be]/90 border border-[#3a2318]/10 transition-colors">
            <Cpu className="w-4 h-4 text-[#5b8076] shrink-0" />
            <span className="font-medium text-[11.5px]">Live voice & transcript</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ebd8be]/60 hover:bg-[#ebd8be]/90 border border-[#3a2318]/10 transition-colors">
            <ShieldCheck className="w-4 h-4 text-[#b4532a] shrink-0" />
            <span className="font-medium text-[11.5px]">Private & encrypted</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ebd8be]/60 hover:bg-[#ebd8be]/90 border border-[#3a2318]/10 transition-colors">
            <Award className="w-4 h-4 text-[#dfa84c] shrink-0" />
            <span className="font-medium text-[11.5px]">STAR rubrics & debrief</span>
          </div>
        </div>
      </div>
    </div>
  );
};
