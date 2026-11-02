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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3a2318]/10 text-[#3a2318] text-[11px] font-mono uppercase tracking-wider mb-2.5">
          <span>Stage 04 of 06</span>
          <span className="opacity-40">•</span>
          <span>Personalization (Optional)</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
          Personalize your <em className="italic text-[#b4532a]">interview context.</em>
        </h2>
        <p className="mt-2 text-sm text-[#3a2318]/75 font-sans">
          Upload your resume and paste a target job description so your AI interviewer can grill you on your exact projects and target requirements. Both are completely optional!
        </p>
      </div>

      <div className="space-y-8">
        {/* SECTION A: Upload Resume */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#b4532a]" />
              <h3 className="font-serif text-xl sm:text-2xl text-[#2a170f]">Upload Candidate Resume</h3>
            </div>
            <span className="text-[11px] font-mono text-[#3a2318]/60 bg-[#3a2318]/10 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <p className="text-xs text-[#3a2318]/75 font-sans leading-relaxed mb-4">
            Our AI parses your technologies, previous accomplishments, and work history to ask authentic behavioral & technical questions directly about your real projects.
          </p>

          {!resume && !isUploading ? (
            <div>
              {/* Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
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
                <div className="w-12 h-12 rounded-full bg-[#3a2318]/10 text-[#3a2318] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#b4532a]" />
                </div>
                <div className="font-serif text-lg text-[#2a170f] mb-1">
                  Drag and drop your resume here, or <span className="text-[#b4532a] underline underline-offset-2">browse files</span>
                </div>
                <div className="text-xs text-[#3a2318]/60 font-sans">
                  Supports PDF or DOCX up to 10MB • Private and securely processed
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
                  className="text-[#b4532a] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Load demo engineering resume</span>
                </button>
              </div>
            </div>
          ) : isUploading ? (
            /* Upload Progress State */
            <div className="rounded-xl bg-[#f8efe0] border border-[#3a2318]/15 p-6 text-center">
              <div className="font-serif text-lg text-[#2a170f] mb-2">Analyzing Resume Structure...</div>
              <p className="text-xs text-[#3a2318]/70 mb-4 font-sans">
                Extracting core engineering projects, skills matrix, and timeline...
              </p>
              <div className="w-full bg-[#3a2318]/10 rounded-full h-2.5 overflow-hidden max-w-md mx-auto mb-2">
                <div
                  className="bg-[#b4532a] h-2.5 rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-xs font-mono text-[#3a2318]/60">{uploadProgress}% complete</div>
            </div>
          ) : resume ? (
            /* Extracted Info Summary */
            <div className="rounded-xl bg-[#f9eed7] border border-[#b4532a]/30 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#3a2318]/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#b4532a] text-white flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif text-base text-[#2a170f] leading-tight font-medium">
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
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-800 bg-red-100/70 hover:bg-red-200/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Replace / Remove</span>
                </button>
              </div>

              {/* Extracted badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-mono text-[#3a2318]/60 mb-1.5 flex items-center gap-1">
                    <Code className="w-3 h-3 text-[#b4532a]" />
                    <span>Extracted Skills & Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-md bg-[#f0e1c2] text-[#2a170f] text-[11px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-mono text-[#3a2318]/60 mb-1.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#5b8076]" />
                    <span>Recognized Work Experience</span>
                  </div>
                  <ul className="space-y-1 text-[#3a2318]/85 font-sans leading-snug">
                    {resume.workExperience.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#5b8076]">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-[11px] font-sans text-[#3a2318]/70 italic flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>The AI interviewer will reference these specific projects during follow-up questions.</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* SECTION B: Add Job Description */}
        <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5b8076]" />
              <h3 className="font-serif text-xl sm:text-2xl text-[#2a170f]">Target Job Description (JD)</h3>
            </div>
            <span className="text-[11px] font-mono text-[#3a2318]/60 bg-[#3a2318]/10 px-2.5 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <p className="text-xs text-[#3a2318]/75 font-sans leading-relaxed mb-3">
            Paste the job posting to align questions with the exact responsibilities, team scale, and tech requirements of your dream role.
          </p>

          <div className="relative">
            <textarea
              rows={4}
              value={jdText}
              onChange={handleJdTextChange}
              placeholder="Paste job description text here (e.g., responsibilities, requirements, qualifications)..."
              maxLength={3000}
              className="w-full p-3.5 rounded-xl bg-white border border-[#3a2318]/20 text-xs sm:text-sm text-[#2a170f] placeholder:text-[#3a2318]/40 focus:outline-none focus:border-[#b4532a] focus:ring-1 focus:ring-[#b4532a] font-sans"
            />
            <div className="flex items-center justify-between text-[11px] text-[#3a2318]/60 mt-1 px-1">
              <button
                type="button"
                onClick={handlePresetJD}
                className="text-[#b4532a] hover:underline font-medium inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Paste sample Senior Engineer JD</span>
              </button>
              <span>{jdText.length} / 3000 characters</span>
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
                  className="rounded text-[#b4532a] focus:ring-[#b4532a] cursor-pointer"
                />
                <label htmlFor="enableJdMatching" className="text-xs text-[#2a170f] font-medium cursor-pointer">
                  Prioritize questions evaluating these specific JD requirements
                </label>
              </div>

              <span className="text-[11px] font-mono text-[#5b8076] font-medium">
                {jobDescription.keySkills.length} key competencies detected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 pt-6 border-t border-[#3a2318]/15 flex items-center justify-between">
        <button
          onClick={() => setCurrentStage('configuration')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-[#eddcc0] text-[#3a2318] text-xs sm:text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configuration</span>
        </button>

        <button
          onClick={() => {
            setCurrentStage('interviewer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs sm:text-sm font-medium transition-all shadow-sm group cursor-pointer"
        >
          <span>Continue to Choose Interviewer</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
