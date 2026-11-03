export type InterviewStage = 
  | 'intro'            // Stage 1: Setup intro
  | 'type-selection'  // Stage 2: Choose interview type
  | 'configuration'   // Stage 3: Configure settings
  | 'personalization' // Stage 4: Resume & JD
  | 'interviewer'     // Stage 5: Select AI interviewer
  | 'preview'         // Stage 6: Summary & confirmation
  | 'device-check'    // Stage 7: Mic, camera, audio check
  | 'live-room'       // Stage 8: Live AI interview room
  | 'processing'      // Stage 9A: Report generation transition
  | 'report';         // Stage 9B: Comprehensive AI performance report

export type AppView = 'landing' | 'interview-flow' | 'history' | 'dashboard' | 'weak-areas';

export type InterviewType = 
  | 'technical'
  | 'behavioral'
  | 'hr'
  | 'coding'
  | 'mixed'
  | 'custom';

export type JobRole = 
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Software Development Engineer'
  | 'Data Analyst'
  | 'Machine Learning Engineer'
  | 'UI/UX Designer'
  | string;

export type ExperienceLevel = 
  | 'Fresher'
  | '0–1 Years'
  | '1–3 Years'
  | '3–5 Years'
  | '5+ Years';

export type InterviewDifficulty = 
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Adaptive Difficulty';

export type InterviewDurationMinutes = 10 | 15 | 30 | 45 | 60;

export type QuestionCountOption = 5 | 10 | 15 | number;

export type InterviewStyle = 
  | 'Conversational Interview'
  | 'Question-by-Question Interview';

export type InterviewLanguage = 
  | 'English'
  | 'Hindi'
  | 'Spanish'
  | 'French'
  | 'German';

export type AIBehaviorTone = 
  | 'Friendly and supportive'
  | 'Professional and formal'
  | 'Strict and challenging'
  | 'Technical expert';

export interface ResumeData {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  skills: string[];
  education: string[];
  projects: string[];
  workExperience: string[];
  technologies: string[];
  certifications: string[];
}

export interface JobDescriptionData {
  title: string;
  text: string;
  extractedRequirements: string[];
  keySkills: string[];
  responsibilities: string[];
  enablePersonalizedJD: boolean;
}

export interface AIInterviewerProfile {
  id: string;
  name: string;
  role: string;
  personality: string;
  interviewStyle: string;
  bio: string;
  portraitUrl: string;
  voiceGender: 'male' | 'female';
  speakingPace: number; // 0.8 to 1.2
  accent: string;
  voiceId?: string; // ElevenLabs voice ID
}

export interface DeviceCheckState {
  micPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  micLevel: number; // 0 to 100
  micDetected: boolean;
  cameraPermission: 'prompt' | 'granted' | 'denied' | 'unsupported';
  cameraEnabled: boolean;
  speakerTested: boolean;
  networkLatencyMs: number;
  aiConnected: boolean;
}

export interface QuestionRubric {
  category: string;
  weight: number;
  keyPoints: string[];
}

export interface QuestionItem {
  id: string;
  order: number;
  question: string;
  category: string;
  difficulty: string;
  expectedConcepts: string[];
  sampleFollowUp?: string;
  rubrics?: QuestionRubric[];
}

export interface UserTurn {
  questionId: string;
  questionText: string;
  userAnswerText: string;
  audioDurationSeconds: number;
  answeredAt: string;
  followUpText?: string;
  userFollowUpAnswerText?: string;
}

export interface QuestionEvaluation {
  questionId: string;
  questionNumber: number;
  category: string;
  originalQuestion: string;
  submittedAnswer: string;
  score: number; // out of 10
  strengths: string[];
  improvements: string[];
  missingConcepts: string[];
  aiFeedback: string;
  suggestedAnswer: string;
  followUpExchange?: {
    question: string;
    answer: string;
    evaluation: string;
  };
}

export interface SkillScore {
  name: string;
  score: number; // 0 - 100
  weight: number;
  summary: string;
}

export interface NextStepPlan {
  topic: string;
  category: 'revision' | 'exercise' | 'concept' | 'mock';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  actionableExercise: string;
}

export interface PerformanceReport {
  id: string;
  interviewId: string;
  createdAt: string;
  overallScore: number; // 0 - 100
  performanceLabel: 'Exceptional Hire' | 'Strong Hire' | 'Promising Candidate' | 'Needs Preparation' | 'Developing Fundamentals';
  interviewType: InterviewType;
  jobRole: string;
  experienceLevel: string;
  difficulty: InterviewDifficulty;
  durationMinutes: number;
  questionsAnswered: number;
  totalPlannedQuestions: number;
  interviewerName: string;
  skillsBreakdown: SkillScore[];
  questionEvaluations: QuestionEvaluation[];
  topStrengths: string[];
  keyAreasToImprove: string[];
  nextStepsRoadmap: NextStepPlan[];
  transcript: {
    speaker: 'ai' | 'user';
    text: string;
    timestamp: string;
  }[];
}

export interface InterviewConfiguration {
  interviewType: InterviewType;
  jobRole: JobRole;
  experienceLevel: ExperienceLevel;
  difficulty: InterviewDifficulty;
  durationMinutes: InterviewDurationMinutes;
  questionCount: QuestionCountOption;
  interviewStyle: InterviewStyle;
  language: InterviewLanguage;
  aiTone: AIBehaviorTone;
  resume?: ResumeData;
  jobDescription?: JobDescriptionData;
  interviewer: AIInterviewerProfile;
}

