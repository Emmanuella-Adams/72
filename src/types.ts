export interface SelfEvaluation {
  score: number; // Calculated: e.g. base values for checked criteria
  recalledCore: boolean;      // Did I recall the grand big-picture concept?
  recalledDetails: boolean;   // Did I list the vital technical facts/vocabulary?
  recalledCaveats: boolean;   // Did I remember the edges, exceptions, or warnings?
  notesCorrect: boolean;      // Or did I cheat/re-read first? Be honest!
  confidenceLevel: 'fragile' | 'steady' | 'bulletproof';
  thoughts: string;           // Optional text reflection on what went wrong or clicked
}

export interface ReviewAttempt {
  date: string;
  explanation: string;
  evaluation: SelfEvaluation;
}

export interface LearningTopic {
  id: string;
  title: string;
  notes: string;
  explanation: string;
  createdAt: string;
  nextReviewDate: string;
  intervalDays: number; // Spaced Repetition: 1, 3, 7, 14 days
  history: ReviewAttempt[];
  evaluation: SelfEvaluation | null;
  customPromptQuestions: string[]; // Self-crafted active-recall testing prompts
}

export interface DashboardStats {
  averageScore: number;
  totalTopics: number;
  reviewsDueToday: number;
}
