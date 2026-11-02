import type { AIInterviewerProfile, InterviewConfiguration, QuestionItem, PerformanceReport, UserTurn } from '../types/interview';

export const AI_INTERVIEWERS: AIInterviewerProfile[] = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Principal Lead & Mentor',
    personality: 'Friendly and supportive',
    interviewStyle: 'Encouraging, conversational, helps you elaborate and eases anxiety.',
    bio: 'Offers constructive encouragement while probing depth. Perfect for calming nerves and finding your cadence.',
    portraitUrl: '/images/rehearse/ai-interviewer/adaptive-listening-robot.webp',
    voiceGender: 'male',
    speakingPace: 1.0,
    accent: 'Neutral American'
  },
  {
    id: 'morgan',
    name: 'Morgan',
    role: 'Engineering Director & Hiring Bar Raiser',
    personality: 'Professional and formal',
    interviewStyle: 'Structured, objective, focuses on rubric-driven evaluations and clean communication.',
    bio: 'Follows rigorous FAANG-style behavioral and technical rubrics with precision timing.',
    portraitUrl: '/images/rehearse/ai-interviewer/robot-interviewer-notes.webp',
    voiceGender: 'female',
    speakingPace: 1.0,
    accent: 'British Formal'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    role: 'Distinguished Architect',
    personality: 'Strict and challenging',
    interviewStyle: 'Relentless deep-diver, questions edge cases, stress-tests architecture and assumptions.',
    bio: 'Never accepts superficial buzzwords. Pushes you to justify performance tradeoffs and failure recovery.',
    portraitUrl: '/images/rehearse/ai-interviewer/pushback-probing-robot.webp',
    voiceGender: 'male',
    speakingPace: 1.05,
    accent: 'Fast-paced Technical'
  },
  {
    id: 'taylor',
    name: 'Taylor',
    role: 'Staff Systems & Infrastructure Specialist',
    personality: 'Technical expert',
    interviewStyle: 'Obsessed with code mechanics, memory layout, protocol design, and algorithmic rigor.',
    bio: 'Balances practical systems engineering with deep computer science fundamentals.',
    portraitUrl: '/images/rehearse/ai-interviewer/robot-evaluator-portrait.webp',
    voiceGender: 'female',
    speakingPace: 0.95,
    accent: 'Analytical Calm'
  }
];

export const DEFAULT_CONFIGURATION: InterviewConfiguration = {
  interviewType: 'technical',
  jobRole: 'Frontend Developer',
  experienceLevel: '1–3 Years',
  difficulty: 'Medium',
  durationMinutes: 30,
  questionCount: 5,
  interviewStyle: 'Conversational Interview',
  language: 'English',
  aiTone: 'Professional and formal',
  interviewer: AI_INTERVIEWERS[1]
};

export const QUESTION_BANKS: Record<string, QuestionItem[]> = {
  'Frontend Developer': [
    {
      id: 'fe-1',
      order: 1,
      category: 'Core React & Virtual DOM',
      difficulty: 'Medium',
      question: 'Can you walk me through how React’s Virtual DOM and reconciliation algorithm work, specifically comparing React 18/19 Fiber architecture against naive DOM diffing?',
      expectedConcepts: ['Virtual DOM tree representation', 'Fiber node work-in-progress tree', 'Time-slicing & concurrent rendering', 'Key reconciliation heuristic'],
      sampleFollowUp: 'If two siblings swap order in a list without keys, how does the Fiber reconciler behave, and what performance penalty occurs?'
    },
    {
      id: 'fe-2',
      order: 2,
      category: 'Performance Optimization',
      difficulty: 'Hard',
      question: 'Imagine a customer dashboard where typing into a search input causes sluggish frame drops in a massive table of 5,000 items. How would you diagnose, profile, and fix this?',
      expectedConcepts: ['Chrome DevTools Performance profiler', 'React DevTools Profiler & flame graphs', 'Virtualization (react-window / TanStack Virtual)', 'useDeferredValue / useTransition', 'Memoization boundaries'],
      sampleFollowUp: 'When would wrapping everything in useMemo and useCallback actually degrade performance rather than improving it?'
    },
    {
      id: 'fe-3',
      order: 3,
      category: 'State Architecture',
      difficulty: 'Medium',
      question: 'How do you decide between local component state, URL-driven state, Server State (React Query / TanStack), and global client stores (Zustand / Redux)?',
      expectedConcepts: ['Single source of truth', 'Server state caching & cache invalidation', 'Shareable deep links via URL query params', 'Avoiding state duplication'],
      sampleFollowUp: 'What strategies do you employ for optimistic UI updates during erratic network latency?'
    },
    {
      id: 'fe-4',
      order: 4,
      category: 'Web Standards & CSS Architecture',
      difficulty: 'Medium',
      question: 'Explain the Critical Rendering Path. What causes layout thrashing and reflows, and how do you engineer responsive CSS to avoid Cumulative Layout Shift (CLS)?',
      expectedConcepts: ['DOM & CSSOM construction', 'Render tree, Layout, Paint, Composite', 'FastDOM batching / avoiding offsetHeight reads in loops', 'Aspect-ratio reservations for images'],
      sampleFollowUp: 'Why is transform/opacity animation handled on the GPU composite thread while top/left triggers layout?'
    },
    {
      id: 'fe-5',
      order: 5,
      category: 'Security & Web APIs',
      difficulty: 'Hard',
      question: 'How do you safeguard a Single Page Application against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)? Where should tokens be stored?',
      expectedConcepts: ['HttpOnly SameSite cookies vs localStorage', 'Content Security Policy (CSP)', 'Sanitizing user-generated markdown/HTML', 'CSRF anti-forgery tokens'],
      sampleFollowUp: 'If an npm sub-dependency is compromised, how does Subresource Integrity (SRI) or CSP restrict data exfiltration?'
    }
  ],
  'Backend Developer': [
    {
      id: 'be-1',
      order: 1,
      category: 'Distributed Systems & Microservices',
      difficulty: 'Hard',
      question: 'How do you ensure data consistency across multiple independent microservices during a financial transaction? Compare 2-Phase Commit (2PC) with the Saga Pattern.',
      expectedConcepts: ['Dual write problem', 'Saga orchestrator vs choreography', 'Compensating transactions', 'Idempotency keys', 'Eventual consistency'],
      sampleFollowUp: 'If a compensating transaction fails halfway due to network partition, how does your system resolve the deadlock?'
    },
    {
      id: 'be-2',
      order: 2,
      category: 'Database Internals & Indexing',
      difficulty: 'Medium',
      question: 'Explain how B-Tree and LSM-Tree indexes differ at the hardware level. When would you choose PostgreSQL with B-Tree over Cassandra or ScyllaDB with LSM-Trees?',
      expectedConcepts: ['Random disk I/O vs sequential write amplification', 'Read path vs write-heavy workloads', 'WAL (Write-Ahead Logging)', 'MemTable and SSTables compaction'],
      sampleFollowUp: 'Can you write or describe an EXPLAIN ANALYZE query and explain what a Bitmap Heap Scan indicates?'
    },
    {
      id: 'be-3',
      order: 3,
      category: 'Caching & Concurrency',
      difficulty: 'Medium',
      question: 'You notice your Redis cache cluster suffering from cache stampede (thundering herd) when a hot product record expires during a flash sale. How do you resolve this?',
      expectedConcepts: ['Probabilistic early expiration (XFetch)', 'Mutex/distributed locks via Redlock', 'Cache-aside with background cron refresh', 'Stale-while-revalidate'],
      sampleFollowUp: 'How do you handle cache invalidation during master-replica replication lag in your primary database?'
    },
    {
      id: 'be-4',
      order: 4,
      category: 'API Design & Resiliency',
      difficulty: 'Medium',
      question: 'How do you implement distributed rate limiting at scale across 20 server instances handling 100,000 requests per second?',
      expectedConcepts: ['Token Bucket vs Leaky Bucket vs Sliding Window Log', 'Redis Lua scripts for atomic increments', 'HTTP 429 Too Many Requests with Retry-After header', 'Graceful degradation'],
      sampleFollowUp: 'What circuit breaker patterns (like Resilience4j or Polly) would you wrap around downstream third-party payment gateways?'
    },
    {
      id: 'be-5',
      order: 5,
      category: 'Message Queues & Streaming',
      difficulty: 'Hard',
      question: 'How do you guarantee strictly ordered, exactly-once message processing in an Apache Kafka or RabbitMQ event-driven pipeline?',
      expectedConcepts: ['Partition key partitioning', 'Kafka consumer offsets & transaction coordinator', 'De-duplication via unique business event IDs', 'At-least-once delivery with idempotent consumers'],
      sampleFollowUp: 'How do you monitor and handle consumer group rebalancing storms?'
    }
  ],
  'Software Development Engineer': [
    {
      id: 'sde-1',
      order: 1,
      category: 'Algorithms & Complexity',
      difficulty: 'Hard',
      question: 'Suppose you have a stream of billions of integers arriving in real time. How would you continuously calculate the median with minimal memory and optimal time complexity?',
      expectedConcepts: ['Two Heaps: Max-Heap for lower half, Min-Heap for upper half', 'O(1) median lookup, O(log N) insertion', 'Reservoir sampling / Count-Min sketch for approximate percentiles at planetary scale'],
      sampleFollowUp: 'How would you scale this solution across a distributed cluster where numbers arrive at multiple ingest nodes?'
    },
    {
      id: 'sde-2',
      order: 2,
      category: 'System Design & Scalability',
      difficulty: 'Hard',
      question: 'Design a distributed URL shortener (like Bitly) supporting 100 million new URLs per day and 10 billion daily redirects. Walk through capacity estimation, schema, and hash generation.',
      expectedConcepts: ['Base62 encoding of 64-bit unique ID', 'Distributed ID generator (Twitter Snowflake or DB sequence range allocation)', 'Read-heavy caching (80/20 rule)', '301 Permanent vs 302 Temporary redirect analytics trade-offs'],
      sampleFollowUp: 'What happens when two concurrent users request custom alias handles simultaneously?'
    },
    {
      id: 'sde-3',
      order: 3,
      category: 'Concurrency & Multi-Threading',
      difficulty: 'Medium',
      question: 'What is a deadlock, and what are the Coffman conditions required for it to occur? How do you prevent deadlocks in high-throughput transactional code?',
      expectedConcepts: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait', 'Resource hierarchy / global lock ordering', 'Optimistic concurrency control with version column'],
      sampleFollowUp: 'How does Compare-And-Swap (CAS) achieve lock-free thread synchronization at the CPU instruction level?'
    },
    {
      id: 'sde-4',
      order: 4,
      category: 'Object Oriented & Clean Architecture',
      difficulty: 'Medium',
      question: 'Can you give a practical example where violating the Liskov Substitution Principle (LSP) or Dependency Inversion Principle (DIP) led to brittle production bugs?',
      expectedConcepts: ['Subtypes must be substitutable for supertypes without altering correctness', 'Square-Rectangle anti-pattern', 'High-level modules should depend on abstractions, not concretions', 'Dependency injection containers'],
      sampleFollowUp: 'How do you draw boundaries between Domain layer, Application use cases, and Infrastructure adapters?'
    },
    {
      id: 'sde-5',
      order: 5,
      category: 'Reliability & Chaos Engineering',
      difficulty: 'Hard',
      question: 'How do you architect a mission-critical service to survive total failure of an entire AWS/GCP cloud region without human intervention?',
      expectedConcepts: ['Multi-region active-active deployment', 'Anycast DNS / Cloudflare Route 53 latency routing', 'Asynchronous cross-region database replication (Spanner / CockroachDB / DynamoDB Global Tables)', 'Handling replication lag during failover'],
      sampleFollowUp: 'How do you prevent split-brain syndrome during inter-region network partitions?'
    }
  ],
  'Behavioral': [
    {
      id: 'beh-1',
      order: 1,
      category: 'Conflict Resolution & Teamwork',
      difficulty: 'Medium',
      question: 'Tell me about a time when you had a severe technical disagreement with a team lead or product manager regarding architecture or deadline compromises. How did you resolve it?',
      expectedConcepts: ['STAR framework: Situation, Task, Action, Result', 'Data-driven prototyping over emotional argument', 'Respectful pushback & active listening', 'Disagree and commit mentality'],
      sampleFollowUp: 'Looking back, was your recommendation truly the right business trade-off or did you learn something from their perspective?'
    },
    {
      id: 'beh-2',
      order: 2,
      category: 'Ownership & Failure',
      difficulty: 'Medium',
      question: 'Describe an occasion where you made a mistake that caused a production outage, missed deadline, or broken client expectation. Walk me through the post-mortem and what you changed.',
      expectedConcepts: ['Blameless ownership', 'Immediate mitigation over finger-pointing', 'Root Cause Analysis (5 Whys)', 'Engineering guardrails: automated tests, canary rollouts, alerting thresholds'],
      sampleFollowUp: 'How did you communicate the outage to non-technical stakeholders and executive leadership during the crisis?'
    },
    {
      id: 'beh-3',
      order: 3,
      category: 'Leadership & Mentorship',
      difficulty: 'Medium',
      question: 'Can you share an example of how you elevated an underperforming or junior teammate and helped them grow into an independent contributor?',
      expectedConcepts: ['Empathy & identifying skill vs confidence gaps', 'Structured pairing & incremental wins', 'Code review etiquette: teaching principles rather than rewriting code', 'Measurable outcomes & career trajectory'],
      sampleFollowUp: 'How did you balance the significant time investment in mentorship against your own committed sprint deliverables?'
    },
    {
      id: 'beh-4',
      order: 4,
      category: 'Ambiguity & Prioritization',
      difficulty: 'Hard',
      question: 'Describe a project where the customer requirements were completely vague, contradictory, or constantly shifting. How did you formulate a technical direction and deliver value?',
      expectedConcepts: ['Deconstructing ambiguity into falsifiable assumptions', 'Rapid MVP spikes & iterative customer validation loops', 'Setting clear milestones and boundaries', 'Preventing scope creep'],
      sampleFollowUp: 'What metrics did you track to verify whether the shipped solution achieved the customer’s actual objective?'
    },
    {
      id: 'beh-5',
      order: 5,
      category: 'Drive for Results under Pressure',
      difficulty: 'Medium',
      question: 'Walk me through a high-stakes project with an immovable deadline. How did you manage scope cut decisions while refusing to compromise on security and test coverage?',
      expectedConcepts: ['Ruthless MVP prioritization: Must-have vs Nice-to-have', 'Transparent communication of technical debt', 'Maintaining testing hygiene to avoid last-minute regressions', 'Delivering on time with high morale'],
      sampleFollowUp: 'How did your team address the accumulated technical debt once the release was celebrated?'
    }
  ],
  'HR': [
    {
      id: 'hr-1',
      order: 1,
      category: 'Professional Narrative & Trajectory',
      difficulty: 'Easy',
      question: 'Walk me through your background and the pivotal career decisions that brought you to where you are today. What is the common thread across your work?',
      expectedConcepts: ['Crisp 90-second elevator pitch', 'Trajectory showing increasing scope & curiosity', 'Highlighting key impact metrics rather than reading resume bullets', 'Articulating clear forward momentum'],
      sampleFollowUp: 'What has been the most fulfilling project you have spearheaded so far, and why?'
    },
    {
      id: 'hr-2',
      order: 2,
      category: 'Company Fit & Motivation',
      difficulty: 'Medium',
      question: 'What specific qualities in our company culture, product roadmap, or engineering ethos make you want to invest the next chapter of your career with us?',
      expectedConcepts: ['Demonstrating genuine research into the company mission', 'Aligning personal values with company culture', 'Specific understanding of market position & challenges', 'Long-term commitment'],
      sampleFollowUp: 'If you had multiple offers on the table with identical compensation, what criteria would decide your final choice?'
    },
    {
      id: 'hr-3',
      order: 3,
      category: 'Self-Awareness & Growth',
      difficulty: 'Medium',
      question: 'What is an authentic weakness or developmental area you received critical feedback on in your last performance review, and what concrete actions have you taken?',
      expectedConcepts: ['Honest vulnerability without false modesty', 'Specific real-world example', 'Measurable improvement system (coaching, books, deliberate practice)', 'Demonstrated progress'],
      sampleFollowUp: 'In what workplace environment or management style do you find you do NOT perform at your best?'
    },
    {
      id: 'hr-4',
      order: 4,
      category: 'Workplace Dynamics & Stress Management',
      difficulty: 'Medium',
      question: 'How do you sustain energy, prevent burnout, and manage cognitive load when deadlines are relentless and multiple priorities compete for your attention?',
      expectedConcepts: ['Time blocking & calendar boundaries', 'Proactive communication of capacity constraints', 'Mental fitness & sustainable pace', 'Prioritization frameworks (Eisenhower Matrix)'],
      sampleFollowUp: 'How do you handle situations where a peer is consistently missing shared deadlines?'
    },
    {
      id: 'hr-5',
      order: 5,
      category: 'Future Ambitions & 5-Year Vision',
      difficulty: 'Easy',
      question: 'Where do you envision yourself five years from now, both in terms of technical craftsmanship and organizational leadership?',
      expectedConcepts: ['Balancing ambition with grounded reality', 'Desire for deepening mastery & broader organizational leverage', 'Mentorship and team multiplication', 'Continuous learner mindset'],
      sampleFollowUp: 'What skills are you currently teaching yourself outside of work hours?'
    }
  ]
};

// Fallback generator for other roles
export function getQuestionsForConfig(config: InterviewConfiguration): QuestionItem[] {
  const role = config.jobRole;
  if (QUESTION_BANKS[role]) {
    return QUESTION_BANKS[role].slice(0, typeof config.questionCount === 'number' ? config.questionCount : 5);
  }
  if (config.interviewType === 'behavioral') {
    return QUESTION_BANKS['Behavioral'].slice(0, typeof config.questionCount === 'number' ? config.questionCount : 5);
  }
  if (config.interviewType === 'hr') {
    return QUESTION_BANKS['HR'].slice(0, typeof config.questionCount === 'number' ? config.questionCount : 5);
  }
  // Generic Software Engineer bank fallback
  return QUESTION_BANKS['Software Development Engineer'].slice(0, typeof config.questionCount === 'number' ? config.questionCount : 5);
}

// Generate an intelligent, realistic, multi-criteria Performance Report
export function generatePerformanceReport(
  config: InterviewConfiguration,
  turns: UserTurn[]
): PerformanceReport {
  const isTech = config.interviewType === 'technical' || config.interviewType === 'coding';
  const totalQuestions = turns.length || 5;

  // Compute realistic scores based on answer depth
  let totalScoreSum = 0;
  const questionEvaluations = turns.map((turn, idx) => {
    const wordCount = turn.userAnswerText.trim().split(/\s+/).filter(Boolean).length;
    // Score scaling: brief answers get 5.5-7.0, thorough answers get 8.5-9.6
    let baseScore = 7.0;
    if (wordCount > 60) baseScore = 8.8;
    else if (wordCount > 30) baseScore = 7.9;
    else if (wordCount > 10) baseScore = 6.8;
    else baseScore = 5.2;

    // Slight variance
    const score = Math.min(9.8, Math.max(5.0, Number((baseScore + (idx % 2 === 0 ? 0.4 : -0.3)).toFixed(1))));
    totalScoreSum += score;

    return {
      questionId: turn.questionId,
      questionNumber: idx + 1,
      category: isTech ? 'Technical & System Concepts' : 'Behavioral & STAR Structure',
      originalQuestion: turn.questionText,
      submittedAnswer: turn.userAnswerText || 'Candidate provided a brief verbal summary of the approach.',
      score,
      strengths: [
        'Articulated the core principle with good foundational clarity.',
        'Maintained structured logic and used relevant industry terminology.',
        wordCount > 40 ? 'Provided concrete practical context from prior implementation experience.' : 'Addressed the question promptly without rambling.'
      ],
      improvements: [
        wordCount < 50 ? 'Could quantify performance metrics (e.g. latency reductions, memory usage percentages).' : 'Could elaborate more on failure modes and edge case recovery.',
        'Frame responses using explicit trade-off analyses (pros vs. cons of chosen design).'
      ],
      missingConcepts: [
        isTech ? 'Explicit concurrency controls & memory footprint trade-offs' : 'Measurable business impact numbers and follow-up retrospective'
      ],
      aiFeedback: `Your response demonstrated solid familiarity with ${config.jobRole} requirements. To move from a strong answer to an exceptional one, anchor the resolution around production metrics and architectural trade-offs.`,
      suggestedAnswer: `In our production environment, I approach this systematically by first identifying the critical path bottlenecks using telemetry profiling. For instance, rather than a monolithic rewrite, we introduce bounded context isolation with strict contracts, automated integration tests, and staged canary rollouts. This reduced latency by 34% while preventing downstream regressions.`,
      followUpExchange: turn.followUpText ? {
        question: turn.followUpText,
        answer: turn.userFollowUpAnswerText || 'Addressed the follow-up with additional edge case specifications.',
        evaluation: 'Candidate responded calmly to pushback and demonstrated flexibility in design constraints.'
      } : undefined
    };
  });

  const avgScoreOutOf10 = questionEvaluations.length > 0 ? (totalScoreSum / questionEvaluations.length) : 8.2;
  const overallScore = Math.round(avgScoreOutOf10 * 10);

  let performanceLabel: PerformanceReport['performanceLabel'] = 'Strong Hire';
  if (overallScore >= 90) performanceLabel = 'Exceptional Hire';
  else if (overallScore >= 80) performanceLabel = 'Strong Hire';
  else if (overallScore >= 70) performanceLabel = 'Promising Candidate';
  else if (overallScore >= 60) performanceLabel = 'Needs Preparation';
  else performanceLabel = 'Developing Fundamentals';

  const skillsBreakdown = isTech ? [
    { name: 'Technical Depth & Concepts', score: Math.min(96, overallScore + 3), weight: 30, summary: 'Command over language semantics, runtime architecture, and core paradigms.' },
    { name: 'Problem-Solving & Tradeoffs', score: Math.min(94, overallScore - 1), weight: 25, summary: 'Ability to deconstruct edge cases and weigh operational trade-offs.' },
    { name: 'Communication & Structure', score: Math.min(98, overallScore + 2), weight: 20, summary: 'Clarity, conciseness, and logical flow of explanations.' },
    { name: 'Production Readiness & Security', score: Math.min(92, overallScore - 4), weight: 15, summary: 'Awareness of observability, testing hygiene, and attack vectors.' },
    { name: 'STAR / Example Relevance', score: Math.min(95, overallScore + 1), weight: 10, summary: 'Grounding concepts in tangible real-world project experience.' }
  ] : [
    { name: 'Communication Clarity', score: Math.min(96, overallScore + 4), weight: 30, summary: 'Articulate tone, cadence, and active listening skills.' },
    { name: 'Situational Reasoning & STAR', score: Math.min(92, overallScore - 2), weight: 25, summary: 'Clear framing of Situation, Task, Action, and measurable Results.' },
    { name: 'Ownership & Accountability', score: Math.min(94, overallScore + 1), weight: 20, summary: 'Blameless retrospectives and strong team execution focus.' },
    { name: 'Conflict Resolution', score: Math.min(90, overallScore - 3), weight: 15, summary: 'Data-driven persuasion and collaborative consensus building.' },
    { name: 'Authenticity & Self-Awareness', score: Math.min(97, overallScore + 2), weight: 10, summary: 'Grounded reflections on growth areas and continuous learning.' }
  ];

  return {
    id: 'rep-' + Date.now().toString(36),
    interviewId: 'int-' + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    overallScore,
    performanceLabel,
    interviewType: config.interviewType,
    jobRole: config.jobRole,
    experienceLevel: config.experienceLevel,
    difficulty: config.difficulty,
    durationMinutes: config.durationMinutes,
    questionsAnswered: questionEvaluations.length,
    totalPlannedQuestions: totalQuestions,
    interviewerName: config.interviewer.name,
    skillsBreakdown,
    questionEvaluations,
    topStrengths: [
      'Strong conceptual intuition and structured explanations that avoided technical rambles.',
      'Demonstrated composure when challenged with follow-up probing questions.',
      'Clear articulation of architectural separation of concerns.',
      'Polished communication delivery with thoughtful pacing.'
    ],
    keyAreasToImprove: [
      'Incorporate more quantified metrics in project outcomes (e.g. "shaved 180ms p99 latency").',
      'Spend more time proactively analyzing edge cases before settling on the initial design.',
      'Deepen mastery of concurrency primitives and fault-tolerance patterns.',
      'Structure behavioral answers strictly around the Action and measurable Business Result.'
    ],
    nextStepsRoadmap: [
      {
        topic: 'Distributed Caching & Concurrency Primitives',
        category: 'concept',
        priority: 'High',
        description: 'Review Cache-Aside, Write-Through, and probabilistic early expiration patterns under high write workloads.',
        actionableExercise: 'Implement a token bucket rate limiter with atomic Redis Lua scripts.'
      },
      {
        topic: 'Quantified STAR Story Refinement',
        category: 'exercise',
        priority: 'High',
        description: 'Revise your 3 primary project narratives so that the "Result" segment specifically includes business KPIs and team velocity impact.',
        actionableExercise: 'Write out 3 STAR bullets with explicit before/after metrics for your headline project.'
      },
      {
        topic: 'Production Fault Tolerance & Observability',
        category: 'revision',
        priority: 'Medium',
        description: 'Study circuit breaker thresholds, bulkhead patterns, and OpenTelemetry trace propagation.',
        actionableExercise: 'Simulate a cascading downstream timeout in a mock backend and verify graceful fallback.'
      },
      {
        topic: 'Adaptive Mock Interview Practice Round',
        category: 'mock',
        priority: 'Medium',
        description: 'Run another 15-minute high-pressure drill with Jordan to sharpen edge-case justifications.',
        actionableExercise: 'Start a targeted mock interview on System Design & Scalability.'
      }
    ],
    transcript: turns.flatMap((t, idx) => [
      { speaker: 'ai', text: t.questionText, timestamp: `0${idx * 3}:10` },
      { speaker: 'user', text: t.userAnswerText, timestamp: `0${idx * 3 + 1}:24` },
      ...(t.followUpText ? [
        { speaker: 'ai' as const, text: t.followUpText, timestamp: `0${idx * 3 + 2}:05` },
        { speaker: 'user' as const, text: t.userFollowUpAnswerText || 'Clarified with further technical rationale.', timestamp: `0${idx * 3 + 2}:45` }
      ] : [])
    ])
  };
}
