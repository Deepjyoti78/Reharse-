import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Layers, 
  Briefcase, 
  Code, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import type { ResumeData, JobDescriptionData } from '../../types/interview';

export const Stage4Personalization: React.FC = () => {
  const { 
    resume, 
    setResume, 
    jobDescription, 
    setJobDescription, 
    setCurrentStage 
  } = useInterview();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Job description state
  const [jdText, setJdText] = useState(jobDescription?.text || '');
  const [enableJdMatching, setEnableJdMatching] = useState(
    jobDescription ? jobDescription.enablePersonalizedJD : true
  );

  const simulateResumeParsing = (fileName: string, fileSizeStr: string) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Simulated extracted data from resume
            const parsedData: ResumeData = {
              fileName,
              fileSize: fileSizeStr,
              uploadDate: 'Just now',
              skills: ['React 18/19', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Docker', 'System Design'],
              education: ['B.S. in Computer Science — State University (2021)'],
              projects: [
                'Distributed Cache-Aside Proxy (99.8% uptime, Go + Redis)',
                'Collaborative Rich Text Canvas (WebSockets, CRDTs)'
              ],
              workExperience: [
                'Software Engineer at Acme Cloud (2.5 yrs) — Scaled API throughput by 40%',
                'Frontend Developer at Studio Nine (1 yr) — Led component library rebuild'
              ],
              technologies: ['Git', 'Vite', 'Jest', 'Cypress', 'Redis', 'AWS S3', 'Figma'],
              certifications: ['AWS Certified Solutions Architect Associate (2023)']
            };
            setResume(parsedData);
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.pdf');

    if (!validTypes.includes(file.type) && !isDocx) {
      setUploadError('Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    simulateResumeParsing(file.name, sizeStr);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      simulateResumeParsing(file.name, sizeStr);
    }
  };

  const handleRemoveResume = () => {
    setResume(undefined);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyPresetResume = () => {
    simulateResumeParsing('John_Doe_Fullstack_Senior_Resume.pdf', '1.4 MB');
  };

  const handleJdTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJdText(val);

    if (val.trim().length > 20) {
      // Extract simulated requirements
      const extractedJD: JobDescriptionData = {
        title: 'Target Role Alignment',
        text: val,
        extractedRequirements: [
          'High throughput production API engineering',
          'Modern state management & client caching',
          'Cross-functional collaboration with product & design',
          'Automated CI/CD testing and observability hygiene'
        ],
        keySkills: ['Distributed Systems', 'React/TypeScript', 'Performance Profiling', 'SQL Optimization'],
        responsibilities: [
          'Design and maintain scalable micro-frontends',
          'Mentor junior contributors and champion clean architecture'
        ],
        enablePersonalizedJD: enableJdMatching
      };
      setJobDescription(extractedJD);
    } else {
      setJobDescription(undefined);
    }
  };

  const handlePresetJD = () => {
    const preset = `We are looking for a passionate Senior Engineer to scale our core web application. You will architect high-performance React applications, optimize frontend caching and Web Vitals, collaborate with design systems teams, and design clean REST/GraphQL APIs backed by PostgreSQL and Redis. Requirements: 3+ years experience with React/TypeScript, deep understanding of the browser rendering pipeline, and a passion for crafting delightful user experiences.`;
    setJdText(preset);
    const extractedJD: JobDescriptionData = {
      title: 'Target Role Alignment',
      text: preset,
      extractedRequirements: [
        '3+ years experience in React/TypeScript',
        'Deep understanding of browser rendering pipeline & Web Vitals',
        'REST/GraphQL API integration with PostgreSQL & Redis',
        'Cross-functional collaboration and mentorship'
      ],
      keySkills: ['React 18/19', 'TypeScript', 'Web Vitals', 'PostgreSQL', 'Redis', 'GraphQL'],
      responsibilities: [
        'Scale core customer dashboard and reduce p99 latency',
        'Collaborate with UI/UX on design system tokens'
      ],
      enablePersonalizedJD: enableJdMatching
    };
    setJobDescription(extractedJD);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-2 sm:px-6 py-2 sm:py-4 animate-fade-in">
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
          Personalize your <em className="italic text-[#b4532a]">interview context.</em>
        </h2>
        <p className="mt-2 text-sm sm:text-[15px] text-[#3a2318]/80 font-sans max-w-xl mx-auto leading-relaxed">
          Upload your resume and target JD so your AI interviewer can grill you on your exact war stories. Both are optional.
        </p>
      </div>

      {/* Unified Master Card (Warm Parchment Palette & Stacked Layout) */}
      <div className="relative isolate z-10 rounded-3xl bg-[#faf0d8] border border-[#3a2318]/15 shadow-md p-5 sm:p-8 md:p-9">
        <div className="space-y-6 sm:space-y-7">
          
          {/* ============ Column 1: Candidate Resume ============ */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <FileText className="w-4 h-4 text-[#b4532a]" />
                  <span>Candidate Resume</span>
                </div>
                <span className="text-[11px] font-mono text-[#3a2318]/60 bg-[#3a2318]/8 px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              {!resume && !isUploading ? (
                <div>
                  {/* Spacious Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#b4532a] bg-[#f5e7c8]'
                        : 'border-[#3a2318]/25 bg-[#f8efe0] hover:bg-[#f3e5cb] hover:border-[#3a2318]/50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-11 h-11 rounded-full bg-[#3a2318]/10 text-[#3a2318] flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5 text-[#b4532a]" />
                    </div>
                    <div className="font-serif text-base sm:text-lg text-[#2a170f] mb-1">
                      Drag and drop your resume here, or <span className="text-[#b4532a] underline underline-offset-2">browse files</span>
                    </div>
                    <div className="text-xs text-[#3a2318]/65 font-sans">
                      Supports PDF or DOCX up to 10MB • Private & securely processed
                    </div>

                    {uploadError && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-700 bg-red-100/80 py-1.5 px-3 rounded-lg max-w-sm mx-auto">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>

                  {/* Sample resume helper */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#3a2318]/70">
                    <span>Don’t have a resume handy?</span>
                    <button
                      type="button"
                      onClick={handleApplyPresetResume}
                      className="text-[#b4532a] hover:underline font-medium inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load demo engineering resume</span>
                    </button>
                  </div>
                </div>
              ) : isUploading ? (
                /* Upload Progress State */
                <div className="rounded-2xl bg-[#f8efe0] border border-[#3a2318]/15 p-7 text-center">
                  <div className="font-serif text-lg text-[#2a170f] mb-1.5">Analyzing Resume Structure...</div>
                  <p className="text-xs text-[#3a2318]/70 mb-4 font-sans">
                    Extracting core engineering projects, skills matrix, and timeline...
                  </p>
                  <div className="w-full bg-[#3a2318]/10 rounded-full h-2.5 overflow-hidden max-w-xs mx-auto mb-2">
                    <div
                      className="bg-[#b4532a] h-2.5 rounded-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-[#3a2318]/60">{uploadProgress}% complete</div>
                </div>
              ) : resume ? (
                /* Extracted Info Summary */
                <div className="rounded-2xl bg-[#f9eed7] border border-[#b4532a]/30 p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#3a2318]/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#b4532a] text-white flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="truncate max-w-[200px] sm:max-w-[240px]">
                        <div className="font-serif text-sm sm:text-base text-[#2a170f] leading-tight font-medium truncate">
                          {resume.fileName}
                        </div>
                        <div className="text-[11px] font-mono text-[#3a2318]/60">
                          {resume.fileSize} • Uploaded successfully
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-800 bg-red-100/70 hover:bg-red-200/80 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Extracted badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-mono text-[#3a2318]/60 mb-1.5 flex items-center gap-1">
                        <Code className="w-3 h-3 text-[#b4532a]" />
                        <span>Extracted Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {resume.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-[#f0e1c2] text-[#2a170f] text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-mono text-[#3a2318]/60 mb-1.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-[#5b8076]" />
                        <span>Experience Highlights</span>
                      </div>
                      <ul className="space-y-1 text-[#3a2318]/85 font-sans leading-snug text-xs max-h-24 overflow-y-auto">
                        {resume.workExperience.map((w, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#5b8076]">•</span>
                            <span className="truncate">{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-1 text-xs font-sans text-[#3a2318]/70 italic flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>The AI interviewer will reference these during follow-up questions.</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* ============ Target Job Description (JD) (Below Resume) ============ */}
          <div className="border-t border-[#3a2318]/10 pt-6">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2a170f] font-sans">
                  <Layers className="w-4 h-4 text-[#5b8076]" />
                  <span>Target Job Description (JD)</span>
                </div>
                <span className="text-[11px] font-mono text-[#3a2318]/60 bg-[#3a2318]/8 px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={5}
                  value={jdText}
                  onChange={handleJdTextChange}
                  placeholder="Paste job posting text here (responsibilities, requirements, qualifications)..."
                  maxLength={3000}
                  className="w-full p-3.5 rounded-2xl bg-white/95 border border-[#3a2318]/20 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans resize-none"
                />
                <div className="flex items-center justify-between text-xs text-[#3a2318]/65 mt-2 px-1">
                  <button
                    type="button"
                    onClick={handlePresetJD}
                    className="text-[#b4532a] hover:underline font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Paste sample Senior Engineer JD</span>
                  </button>
                  <span>{jdText.length} / 3000 chars</span>
                </div>
              </div>

              {/* Toggle for personalized questions */}
              {jobDescription && (
                <div className="mt-4 pt-3 border-t border-[#3a2318]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableJdMatching"
                      checked={enableJdMatching}
                      onChange={(e) => {
                        setEnableJdMatching(e.target.checked);
                        if (jobDescription) {
                          setJobDescription({ ...jobDescription, enablePersonalizedJD: e.target.checked });
                        }
                      }}
                      className="rounded text-[#b4532a] focus:ring-[#b4532a] cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="enableJdMatching" className="text-xs text-[#2a170f] font-medium cursor-pointer">
                      Prioritize questions evaluating these JD requirements
                    </label>
                  </div>

                  <span className="text-xs font-mono text-[#5b8076] font-medium">
                    {jobDescription.keySkills.length} competencies detected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation Inside Master Card */}
        <div className="mt-6 sm:mt-8 pt-5 border-t border-[#3a2318]/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentStage('configuration')}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#f0e3c5] hover:bg-[#e6d6b2] text-[#2a170f] text-xs sm:text-sm font-medium font-sans border border-[#3a2318]/20 transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#b4532a] transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Configuration</span>
          </button>

          <button
            onClick={() => {
              setCurrentStage('interviewer');
              window.scrollTo(0, 0);
            }}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-md group cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Continue to Choose Interviewer</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
