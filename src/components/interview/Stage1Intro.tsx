import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Target, ShieldCheck, Cpu, Award } from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';

export const Stage1Intro: React.FC = () => {
  const { setCurrentStage, exitToDashboard, config, updateConfig } = useInterview();

  const handleSelectQuickRole = (role: string) => {
    updateConfig({ jobRole: role });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Return button */}
      <button
        onClick={exitToDashboard}
        className="inline-flex items-center gap-1.5 text-xs text-[#3a2318]/70 hover:text-[#3a2318] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to overview</span>
      </button>

      {/* Main Hero Card */}
      <div className="relative rounded-3xl bg-[#faf3e3] border border-[#3a2318]/15 shadow-sm overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b4532a]/10 border border-[#b4532a]/20 text-[#b4532a] text-[11px] font-sans font-medium tracking-wide uppercase mb-4">
              <Sparkles className="w-3 h-3 text-[#b4532a]" />
              <span>Personalized AI Mock Interview Setup</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] text-[#2a170f] font-normal mb-3">
              Let’s prepare for your <br />
              <em className="italic text-[#b4532a]">next interview.</em>
            </h1>

            <p className="text-sm sm:text-[15px] text-[#3a2318]/80 leading-relaxed font-sans mb-6">
              You are about to configure a custom simulated interview. In the next few steps, you’ll pick your interview track, adjust the difficulty and tone, optionally upload your resume for tailored questions, test your microphone, and step into an authentic live session.
            </p>

            {/* Quick Role Pickers */}
            <div className="mb-8">
              <div className="text-[11px] uppercase tracking-wider text-[#3a2318]/60 font-mono mb-2.5">
                Quick select target role:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Frontend Developer',
                  'Backend Developer',
                  'Software Development Engineer',
                  'Data Analyst',
                  'UI/UX Designer'
                ].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectQuickRole(role)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      config.jobRole === role
                        ? 'bg-[#3a2318] text-[#f8eed8] shadow-xs'
                        : 'bg-[#f0e3c5] text-[#3a2318] hover:bg-[#e6d6b2]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentStage('type-selection')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] font-sans text-sm font-medium transition-all shadow-md group cursor-pointer"
              >
                <span>Choose Interview Type</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={exitToDashboard}
                className="px-5 py-3 rounded-full bg-transparent hover:bg-[#f0e3c5]/50 text-[#3a2318] font-sans text-sm font-medium transition-all"
              >
                Cancel & return
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-[#3a2318]/20 shadow-inner bg-[#eddcc0]">
              <img
                src="/images/rehearse/practice/candidate-preparation.webp"
                alt="Candidate preparing for interview with notes and vintage study lamp"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a170f]/80 via-transparent to-transparent flex flex-col justify-end p-4 text-[#f8eed8]">
                <div className="font-serif text-lg leading-tight">Authentic conversational depth</div>
                <div className="text-[11px] text-[#f8eed8]/80 mt-0.5 font-sans">
                  Adaptive AI that pushes back on weak assumptions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars footer within card */}
        <div className="mt-8 pt-6 border-t border-[#3a2318]/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans text-[#3a2318]/85">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#b4532a] shrink-0" />
            <span>Role-tailored question banks</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#5b8076] shrink-0" />
            <span>Live voice & transcript capture</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#b4532a] shrink-0" />
            <span>Private & encrypted room</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#dfa84c] shrink-0" />
            <span>STAR rubrics & scoring debrief</span>
          </div>
        </div>
      </div>
    </div>
  );
};

