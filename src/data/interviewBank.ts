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
    accent: 'Neutral American',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb' // George - Warm, Engaging & Conversational
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
    accent: 'British Formal',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2' // Alice - Clear, Articulate & Professional
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
    accent: 'Fast-paced Technical',
    voiceId: 'pNInz6obpgDQGcFmaJgB' // Adam - Dominant, Firm & Authoritative
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
    accent: 'Analytical Calm',
    voiceId: 'EXAVITQu4vr4xnSDxMaL' // Sarah - Mature, Confident & Reassuring
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

// Helper to evaluate an individual turn's answer quality realistically
function evaluateCandidateAnswer(
  turn: UserTurn,
  expectedConcepts: string[] = [],
  isTech: boolean,
  jobRole: string
) {
  const primaryAnswer = (turn.userAnswerText || '').trim();
  const lowerAnswer = primaryAnswer.toLowerCase();
  const words = primaryAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const followUpAnswer = (turn.userFollowUpAnswerText || '').trim();
  const lowerFollowUp = followUpAnswer.toLowerCase();
  const followUpWordCount = followUpAnswer.split(/\s+/).filter(Boolean).length;

  // 1. Check for non-answers, refusal, or explicit admissions of ignorance
  const ignorancePatterns = [
    /\b(don'?t know|do not know|no idea|no clue|dunno|not sure|have no idea|cannot answer|can't answer|skip|pass|nothing|idk|n\/a|not familiar|no experience|have no knowledge|zero idea|dont know)\b/i,
    /\b(i have no idea|i dont have any idea|no clue about this|never worked with|never heard of)\b/i
  ];

  const expressesIgnorance = ignorancePatterns.some(p => p.test(lowerAnswer));
  const isTooShort = wordCount < 6;
  const isRepetitiveGibberish = wordCount > 5 && new Set(words.map(w => w.toLowerCase())).size <= 3;

  // If candidate admitted ignorance, gave empty answer, or gibberish
  if (expressesIgnorance || isTooShort || isRepetitiveGibberish) {
    const score = Number((Math.random() * 0.8 + 1.2).toFixed(1)); // 1.2 - 2.0 / 10

    return {
      score,
      strengths: [
        'Candidate was candid about their lack of knowledge on this question rather than guessing inaccurately.',
        'Acknowledged domain boundaries promptly.'
      ],
      improvements: [
        `This fundamental question on "${turn.questionText.slice(0, 50)}..." was unanswered or skipped.`,
        expectedConcepts.length > 0 
          ? `Urgent revision needed for core concepts: ${expectedConcepts.slice(0, 3).join(', ')}.`
          : `Review foundational theory and practical application for ${jobRole}.`
      ],
      missingConcepts: expectedConcepts.length > 0 
        ? expectedConcepts 
        : ['Foundational concept comprehension', 'Concrete architectural application', 'Structured explanation'],
      aiFeedback: `You stated that you did not know the answer or passed on this question ("${primaryAnswer || 'No response provided'}"). In an actual ${jobRole} interview, leaving core questions unanswered creates an immediate knowledge gap. Study the calibrated model answer below to understand how to approach this topic.`,
      followUpEvaluation: turn.followUpText ? {
        question: turn.followUpText,
        answer: followUpAnswer || 'No follow-up response provided.',
        evaluation: followUpWordCount > 8 && !ignorancePatterns.some(p => p.test(lowerFollowUp))
          ? 'Candidate attempted to provide partial context in the follow-up.'
          : 'Follow-up was also unanswered or lacked technical content.'
      } : undefined
    };
  }

  // 2. Keyword relevance check
  const matchedConcepts = expectedConcepts.filter(concept => {
    const conceptWords = concept.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return conceptWords.some(w => lowerAnswer.includes(w));
  });

  const keywordCoverageRatio = expectedConcepts.length > 0 
    ? matchedConcepts.length / expectedConcepts.length 
    : 0.5;

  // 3. Technical & structural score calculation
  let baseScore = 4.5;

  if (wordCount >= 100) baseScore += 2.8;
  else if (wordCount >= 60) baseScore += 2.2;
  else if (wordCount >= 30) baseScore += 1.4;
  else if (wordCount >= 15) baseScore += 0.6;

  // Keyword bonus
  baseScore += keywordCoverageRatio * 2.2;

  // Check for STAR indicators (Situation, Task, Action, Result) or metrics
  const hasMetrics = /\d+(%|ms|s|x|k|m|gb|mb)/i.test(primaryAnswer);
  const hasTradeoffs = /\b(trade-off|tradeoff|pros|cons|however|whereas|alternatively|versus|vs|compromise)\b/i.test(lowerAnswer);
  const hasStructure = /\b(first|then|finally|result|because|outcome|achieved|implemented)\b/i.test(lowerAnswer);

  if (hasMetrics) baseScore += 0.5;
  if (hasTradeoffs) baseScore += 0.4;
  if (hasStructure) baseScore += 0.3;

  // Follow-up adjustment
  if (turn.followUpText) {
    if (followUpWordCount > 25 && !ignorancePatterns.some(p => p.test(lowerFollowUp))) {
      baseScore += 0.6;
    } else if (ignorancePatterns.some(p => p.test(lowerFollowUp)) || followUpWordCount < 5) {
      baseScore -= 0.6;
    }
  }

  // Clamp score between 3.0 and 9.7
  const score = Number(Math.min(9.7, Math.max(3.0, baseScore)).toFixed(1));

  // Dynamic feedback and strengths based on actual content
  const strengths: string[] = [];
  if (hasStructure) strengths.push('Structured the response with a clear sequential progression.');
  if (hasMetrics) strengths.push('Effectively grounded claims with quantified impact and performance metrics.');
  if (hasTradeoffs) strengths.push('Demonstrated architectural maturity by analyzing trade-offs between alternative designs.');
  if (matchedConcepts.length > 0) strengths.push(`Demonstrated familiarity with ${matchedConcepts.slice(0, 2).join(' and ')}.`);
  if (strengths.length === 0) strengths.push('Provided an initial high-level verbal response to the prompt.');

  const improvements: string[] = [];
  if (!hasMetrics) improvements.push('Incorporate measurable metrics (e.g., latency reduction percentages, throughput numbers, team time saved).');
  if (!hasTradeoffs) improvements.push('Address alternative approaches and explain why you chose this design over other options.');
  if (wordCount < 45) improvements.push('Provide more depth by explaining production failure modes, edge cases, and recovery strategies.');
  if (matchedConcepts.length < expectedConcepts.length && expectedConcepts.length > 0) {
    const missing = expectedConcepts.filter(c => !matchedConcepts.includes(c));
    if (missing.length > 0) improvements.push(`Deepen coverage of: ${missing.slice(0, 2).join(', ')}.`);
  }

  const missingConcepts = expectedConcepts.filter(c => !matchedConcepts.includes(c));

  return {
    score,
    strengths,
    improvements: improvements.slice(0, 2),
    missingConcepts: missingConcepts.length > 0 
      ? missingConcepts 
      : (isTech ? ['Low-level concurrency edge cases under peak scale'] : ['Long-term team retrospectives']),
    aiFeedback: score >= 8.5
      ? `Strong, well-articulated response for ${jobRole}. You communicated key concepts with clarity. To reach staff-level excellence, continue sharpening edge-case handling under extreme load.`
      : score >= 6.5
        ? `Decent foundational start. Your answer touches the core idea but lacks the deeper architectural justification and metrics required to stand out at the senior bar.`
        : `Your response was overly brief or missed critical technical concepts for ${jobRole}. Anchor your answers around practical implementation details and explicit trade-offs.`,
    followUpEvaluation: turn.followUpText ? {
      question: turn.followUpText,
      answer: followUpAnswer || 'No follow-up response provided.',
      evaluation: followUpWordCount > 20
        ? 'Responded effectively to interviewer probing with additional nuance.'
        : 'Follow-up answer was brief; try to elaborate more when challenged on failure cases.'
    } : undefined
  };
}

// Generate an intelligent, realistic, multi-criteria Performance Report
export function generatePerformanceReport(
  config: InterviewConfiguration,
  turns: UserTurn[]
): PerformanceReport {
  const isTech = config.interviewType === 'technical' || config.interviewType === 'coding';
  const totalQuestions = turns.length || 5;

  // Retrieve matching questions to cross-reference expected concepts
  const availableQuestions = getQuestionsForConfig(config);

  // Compute realistic scores based on actual answer depth and accuracy
  let totalScoreSum = 0;
  const questionEvaluations = turns.map((turn, idx) => {
    const matchedQ = availableQuestions.find(q => q.id === turn.questionId || q.question === turn.questionText) 
      || availableQuestions[idx % availableQuestions.length];

    const expectedConcepts = matchedQ?.expectedConcepts || [];
    const evaluation = evaluateCandidateAnswer(turn, expectedConcepts, isTech, config.jobRole);

    totalScoreSum += evaluation.score;

    return {
      questionId: turn.questionId,
      questionNumber: idx + 1,
      category: matchedQ?.category || (isTech ? 'Technical Architecture' : 'Behavioral & Leadership'),
      originalQuestion: turn.questionText,
      submittedAnswer: turn.userAnswerText || 'Candidate did not provide an answer.',
      score: evaluation.score,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      missingConcepts: evaluation.missingConcepts,
      aiFeedback: evaluation.aiFeedback,
      suggestedAnswer: matchedQ?.sampleFollowUp 
        ? `A comprehensive answer should start by framing the context, explaining the technical principles (${expectedConcepts.slice(0, 3).join(', ')}), and quantifying the outcome. For example: "In our production system, we resolved this by implementing ${expectedConcepts[0] || 'bounded context isolation'}, which reduced error rates by 42% under load."`
        : `In our production environment, I approach this systematically by first identifying the critical path bottlenecks using telemetry profiling. Rather than a monolithic rewrite, we introduce bounded context isolation with strict contracts, automated integration tests, and staged canary rollouts. This reduced p99 latency by 34% while preventing downstream regressions.`,
      followUpExchange: evaluation.followUpEvaluation
    };
  });

  const avgScoreOutOf10 = questionEvaluations.length > 0 ? (totalScoreSum / questionEvaluations.length) : 2.0;
  const overallScore = Math.min(100, Math.max(10, Math.round(avgScoreOutOf10 * 10)));

  // Dynamic performance label reflecting actual answers
  let performanceLabel: PerformanceReport['performanceLabel'] = 'Strong Hire';
  if (overallScore >= 88) performanceLabel = 'Exceptional Hire';
  else if (overallScore >= 78) performanceLabel = 'Strong Hire';
  else if (overallScore >= 65) performanceLabel = 'Promising Candidate';
  else if (overallScore >= 45) performanceLabel = 'Needs Preparation';
  else performanceLabel = 'Developing Fundamentals';

  // Dynamic skills breakdown scaled accurately with candidate's actual score
  const skillsBreakdown = isTech ? [
    { 
      name: 'Technical Depth & Concepts', 
      score: Math.min(98, Math.max(8, overallScore + (overallScore > 50 ? 2 : -4))), 
      weight: 30, 
      summary: overallScore > 50 
        ? 'Command over language semantics, runtime architecture, and core paradigms.' 
        : 'Significant conceptual gaps in core language semantics and runtime fundamentals.'
    },
    { 
      name: 'Problem-Solving & Tradeoffs', 
      score: Math.min(96, Math.max(10, overallScore - (overallScore > 50 ? 2 : 2))), 
      weight: 25, 
      summary: overallScore > 50 
        ? 'Ability to deconstruct edge cases and weigh operational trade-offs.' 
        : 'Needs systematic framework to analyze edge cases and evaluate design alternatives.'
    },
    { 
      name: 'Communication & Structure', 
      score: Math.min(98, Math.max(12, overallScore + (overallScore > 50 ? 4 : 5))), 
      weight: 20, 
      summary: 'Clarity, conciseness, and logical flow of explanations.' 
    },
    { 
      name: 'Production Readiness & Security', 
      score: Math.min(94, Math.max(8, overallScore - (overallScore > 50 ? 4 : 5))), 
      weight: 15, 
      summary: overallScore > 50 
        ? 'Awareness of observability, testing hygiene, and attack vectors.' 
        : 'Production hardening, observability, and security constraints were not addressed.'
    },
    { 
      name: 'STAR / Example Relevance', 
      score: Math.min(95, Math.max(10, overallScore + 1)), 
      weight: 10, 
      summary: overallScore > 50 
        ? 'Grounding concepts in tangible real-world project experience.' 
        : 'Few concrete project outcomes or real-world examples cited.'
    }
  ] : [
    { 
      name: 'Communication Clarity', 
      score: Math.min(98, Math.max(12, overallScore + 4)), 
      weight: 30, 
      summary: 'Articulate tone, cadence, and active listening skills.' 
    },
    { 
      name: 'Situational Reasoning & STAR', 
      score: Math.min(94, Math.max(10, overallScore - 2)), 
      weight: 25, 
      summary: 'Framing of Situation, Task, Action, and measurable Results.' 
    },
    { 
      name: 'Ownership & Accountability', 
      score: Math.min(95, Math.max(10, overallScore + 1)), 
      weight: 20, 
      summary: 'Blameless retrospectives and strong team execution focus.' 
    },
    { 
      name: 'Conflict Resolution', 
      score: Math.min(92, Math.max(8, overallScore - 4)), 
      weight: 15, 
      summary: 'Data-driven persuasion and collaborative consensus building.' 
    },
    { 
      name: 'Authenticity & Self-Awareness', 
      score: Math.min(98, Math.max(15, overallScore + 3)), 
      weight: 10, 
      summary: 'Grounded reflections on growth areas and continuous learning.' 
    }
  ];

  // Dynamic top strengths and improvement areas
  const topStrengths = overallScore >= 70 ? [
    'Strong conceptual intuition and structured explanations that avoided technical rambles.',
    'Demonstrated composure when challenged with follow-up probing questions.',
    'Clear articulation of architectural separation of concerns.',
    'Polished communication delivery with thoughtful pacing.'
  ] : overallScore >= 45 ? [
    'Showed good willingness to engage and provide initial high-level concepts.',
    'Maintained a professional tone throughout the session.',
    'Communicated clearly on familiar topics.'
  ] : [
    'Candidate was honest about unfamiliar areas rather than presenting fabricated facts.',
    'Demonstrated awareness of baseline knowledge boundaries.',
    'Clear baseline to build upon with structured preparation.'
  ];

  const keyAreasToImprove = overallScore >= 70 ? [
    'Incorporate more quantified metrics in project outcomes (e.g. "shaved 180ms p99 latency").',
    'Spend more time proactively analyzing edge cases before settling on the initial design.',
    'Deepen mastery of concurrency primitives and fault-tolerance patterns.',
    'Structure behavioral answers strictly around the Action and measurable Business Result.'
  ] : [
    `Develop foundational mastery of ${config.jobRole} core concepts before the next interview round.`,
    'Avoid skipping questions or providing answers consisting solely of "I don\'t know".',
    'Structure responses using the STAR method: Situation, Task, Action, and measurable Result.',
    'Study the model answers provided in this debrief for every question.'
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
    topStrengths,
    keyAreasToImprove,
    nextStepsRoadmap: overallScore >= 70 ? [
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
    ] : [
      {
        topic: `${config.jobRole} Core Technical Foundations`,
        category: 'concept',
        priority: 'High',
        description: `Deeply review the primary questions from this interview and memorize their core architectural principles.`,
        actionableExercise: 'Write out written summaries for each question missed in this round.'
      },
      {
        topic: 'Structured Verbal Framing (STAR)',
        category: 'exercise',
        priority: 'High',
        description: 'When unsure of a full solution, outline your problem-solving framework aloud instead of passing immediately.',
        actionableExercise: 'Practice thinking aloud: state assumptions, propose an initial brute-force approach, then refine.'
      },
      {
        topic: 'Foundations Diagnostic Rehearsal',
        category: 'mock',
        priority: 'High',
        description: 'Run a 10-minute Easy session with Alex (Supportive Mentor) to build rhythm and confidence.',
        actionableExercise: 'Configure an Easy difficulty round and practice answering every question.'
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
