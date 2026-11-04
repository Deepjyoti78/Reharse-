import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  InterviewStage,
  AppView,
  InterviewConfiguration,
  ResumeData,
  JobDescriptionData,
  AIInterviewerProfile,
  DeviceCheckState,
  UserTurn,
  PerformanceReport,
  InterviewType
} from '../types/interview';
import { AI_INTERVIEWERS, DEFAULT_CONFIGURATION, generatePerformanceReport } from '../data/interviewBank';
import { stopElevenLabsSpeech } from '../services/elevenlabs';

interface InterviewContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentStage: InterviewStage;
  setCurrentStage: (stage: InterviewStage) => void;
  config: InterviewConfiguration;
  updateConfig: (partial: Partial<InterviewConfiguration>) => void;
  resume: ResumeData | undefined;
  setResume: (resume: ResumeData | undefined) => void;
  jobDescription: JobDescriptionData | undefined;
  setJobDescription: (jd: JobDescriptionData | undefined) => void;
  selectedInterviewer: AIInterviewerProfile;
  setSelectedInterviewer: (interviewer: AIInterviewerProfile) => void;
  deviceState: DeviceCheckState;
  updateDeviceState: (partial: Partial<DeviceCheckState>) => void;
  turns: UserTurn[];
  addTurn: (turn: UserTurn) => void;
  activeReport: PerformanceReport | null;
  setActiveReport: (report: PerformanceReport | null) => void;
  pastReports: PerformanceReport[];
  saveReportToHistory: (report: PerformanceReport) => void;
  deleteReportFromHistory: (reportId: string) => void;
  startInterviewFlow: (role?: string, type?: InterviewType) => void;
  restartWithSameConfig: () => void;
  finishInterview: (finalTurns?: UserTurn[]) => void;
  exitToDashboard: () => void;
  registerMediaStream: (stream: MediaStream) => void;
  unregisterMediaStream: (stream: MediaStream) => void;
  stopAllMediaHardware: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

const STORAGE_KEY_REPORTS = 'rehearse_performance_reports_v1';

// Seed initial reports if empty for a rich dashboard demonstration
const INITIAL_DEMO_REPORTS: PerformanceReport[] = [
  {
    id: 'rep-demo-1',
    interviewId: 'int-demo-fe',
    createdAt: 'Yesterday at 4:15 PM',
    overallScore: 88,
    performanceLabel: 'Strong Hire',
    interviewType: 'technical',
    jobRole: 'Frontend Developer',
    experienceLevel: '1–3 Years',
    difficulty: 'Medium',
    durationMinutes: 30,
    questionsAnswered: 5,
    totalPlannedQuestions: 5,
    interviewerName: 'Morgan',
    skillsBreakdown: [
      { name: 'Technical Depth & Concepts', score: 91, weight: 30, summary: 'Solid grasp of React Fiber reconciler and memoization boundaries.' },
      { name: 'Problem-Solving & Tradeoffs', score: 86, weight: 25, summary: 'Good intuition on virtualization for table rendering.' },
      { name: 'Communication & Structure', score: 90, weight: 20, summary: 'Structured reasoning with crisp terminology.' },
      { name: 'Production Readiness & Security', score: 84, weight: 15, summary: 'Awareness of CSP headers and token storage security.' },
      { name: 'STAR / Example Relevance', score: 89, weight: 10, summary: 'Concrete examples from previous design system migration.' }
    ],
    questionEvaluations: [
      {
        questionId: 'demo-q1',
        questionNumber: 1,
        category: 'Core React & Virtual DOM',
        originalQuestion: 'Can you walk me through how React’s Virtual DOM and reconciliation algorithm work, specifically comparing React 18/19 Fiber architecture against naive DOM diffing?',
        submittedAnswer: 'React maintains a lightweight in-memory representation of the actual DOM called the Virtual DOM. When state changes occur, React compares the new VDOM tree with the previous one. In Fiber, this is divided into incremental units of work that can be paused or aborted during browser idle frames.',
        score: 9.1,
        strengths: ['Accurate explanation of cooperative scheduling and Fiber work-in-progress trees.'],
        improvements: ['Could detail the commit phase vs render phase lifecycle hooks.'],
        missingConcepts: ['Explicit mention of the key reconciliation heuristic for sibling reordering.'],
        aiFeedback: 'Superb conceptual clarity on time-slicing and concurrent mode rendering.',
        suggestedAnswer: 'React Fiber deconstructs reconciliation into two phases: a non-blocking, interruptible render phase where the work-in-progress fiber tree is calculated, and a synchronous commit phase where mutations are applied to the host DOM. This prevents main thread starvation on large updates.'
      }
    ],
    topStrengths: [
      'Excellent grasp of modern front-end performance profiling tools.',
      'Calm communication style when handling technical pushback.',
      'Precise use of architectural concepts.'
    ],
    keyAreasToImprove: [
      'Deepen knowledge of Web Workers for CPU-bound computations.',
      'Quantify benchmark improvements in project narratives.'
    ],
    nextStepsRoadmap: [
      {
        topic: 'Concurrent React & Server Components',
        category: 'concept',
        priority: 'High',
        description: 'Practice explaining React Server Component wire formats and streaming SSR architecture.',
        actionableExercise: 'Build a small prototype demonstrating Suspense boundaries with streaming HTML.'
      }
    ],
    transcript: [
      { speaker: 'ai', text: 'Welcome to your technical round. Let’s start with React Fiber fundamentals.', timestamp: '00:05' },
      { speaker: 'user', text: 'Glad to be here. Virtual DOM diffing in Fiber operates on a linked list structure...', timestamp: '00:25' }
    ]
  }
];

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [currentStage, setCurrentStage] = useState<InterviewStage>('intro');
  const [config, setConfig] = useState<InterviewConfiguration>(DEFAULT_CONFIGURATION);
  const [resume, setResume] = useState<ResumeData | undefined>(undefined);
  const [jobDescription, setJobDescription] = useState<JobDescriptionData | undefined>(undefined);
  const [selectedInterviewer, setSelectedInterviewer] = useState<AIInterviewerProfile>(AI_INTERVIEWERS[1]);
  const [turns, setTurns] = useState<UserTurn[]>([]);
  const [activeReport, setActiveReport] = useState<PerformanceReport | null>(null);

  const [deviceState, setDeviceState] = useState<DeviceCheckState>({
    micPermission: 'prompt',
    micLevel: 0,
    micDetected: false,
    cameraPermission: 'prompt',
    cameraEnabled: true,
    speakerTested: false,
    networkLatencyMs: 38,
    aiConnected: true
  });

  // Load past reports from localStorage
  const [pastReports, setPastReports] = useState<PerformanceReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_DEMO_REPORTS;
  });

  // Save past reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(pastReports));
    } catch {
      // ignore
    }
  }, [pastReports]);

  const updateConfig = (partial: Partial<InterviewConfiguration>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const updateDeviceState = (partial: Partial<DeviceCheckState>) => {
    setDeviceState(prev => ({ ...prev, ...partial }));
  };

  const addTurn = (turn: UserTurn) => {
    setTurns(prev => [...prev, turn]);
  };

  const saveReportToHistory = (report: PerformanceReport) => {
    setPastReports(prev => [report, ...prev.filter(r => r.id !== report.id)]);
  };

  const deleteReportFromHistory = (reportId: string) => {
    setPastReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Global registry of all active media streams to guarantee 100% hardware release
  const activeStreamsRef = useRef<Set<MediaStream>>(new Set());

  const registerMediaStream = (stream: MediaStream) => {
    if (stream) {
      activeStreamsRef.current.add(stream);
    }
  };

  const unregisterMediaStream = (stream: MediaStream) => {
    if (stream) {
      activeStreamsRef.current.delete(stream);
    }
  };

  const stopAllMediaHardware = () => {
    // 1. Force stop and disable every registered MediaStreamTrack
    activeStreamsRef.current.forEach(stream => {
      try {
        stream.getTracks().forEach(track => {
          try {
            track.enabled = false;
            track.stop();
          } catch (e) {
            console.warn('Track stop warning:', e);
          }
        });
      } catch (err) {
        console.warn('Stream stop warning:', err);
      }
    });
    activeStreamsRef.current.clear();

    // 2. Clear srcObject on all HTML video and audio elements in document to release browser camera/mic locks
    if (typeof document !== 'undefined') {
      try {
        const mediaElements = document.querySelectorAll('video, audio');
        mediaElements.forEach((el) => {
          try {
            const mediaEl = el as HTMLMediaElement;
            mediaEl.pause();
            if (mediaEl.srcObject) {
              const srcObj = mediaEl.srcObject as MediaStream;
              if (srcObj && srcObj.getTracks) {
                srcObj.getTracks().forEach(track => {
                  try {
                    track.enabled = false;
                    track.stop();
                  } catch {}
                });
              }
              mediaEl.srcObject = null;
            }
          } catch {}
        });
      } catch {}
    }

    // 3. Stop any active ElevenLabs TTS playback
    try {
      stopElevenLabsSpeech();
    } catch {}
  };

  const startInterviewFlow = (role?: string, type?: InterviewType) => {
    stopAllMediaHardware();
    if (role) {
      setConfig(prev => ({ ...prev, jobRole: role }));
    }
    if (type) {
      setConfig(prev => ({ ...prev, interviewType: type }));
    }
    setTurns([]);
    setActiveReport(null);
    setCurrentStage('intro');
    setCurrentView('interview-flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartWithSameConfig = () => {
    stopAllMediaHardware();
    setTurns([]);
    setActiveReport(null);
    setCurrentStage('preview');
    setCurrentView('interview-flow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishInterview = (finalTurns?: UserTurn[]) => {
    // Crucial: immediately kill all media hardware and video/audio locks
    stopAllMediaHardware();

    // Generate report using supplied or committed turns
    const candidateTurns = finalTurns || turns;
    const report = generatePerformanceReport(config, candidateTurns);
    if (finalTurns) {
      setTurns(finalTurns);
    }
    setActiveReport(report);
    saveReportToHistory(report);
    setCurrentStage('processing');
  };

  const exitToDashboard = () => {
    stopAllMediaHardware();
    setCurrentView('landing');
    setCurrentStage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <InterviewContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentStage,
        setCurrentStage,
        config,
        updateConfig,
        resume,
        setResume,
        jobDescription,
        setJobDescription,
        selectedInterviewer,
        setSelectedInterviewer,
        deviceState,
        updateDeviceState,
        turns,
        addTurn,
        activeReport,
        setActiveReport,
        pastReports,
        saveReportToHistory,
        deleteReportFromHistory,
        startInterviewFlow,
        restartWithSameConfig,
        finishInterview,
        exitToDashboard,
        registerMediaStream,
        unregisterMediaStream,
        stopAllMediaHardware
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
