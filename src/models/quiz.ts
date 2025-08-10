import { Quiz } from "./api";
interface AnswerOption {
  explanation: string;
  text: string;
  isCorrect: boolean;
}
export interface Question {
  id: string,
  chapterId: string,
  subjectId: string,
  grade: number,
  board: string,
  questionType: "MCQ" | "TRUE_FALSE" | "MSTQ",
  questionText: string,
  options: AnswerOption[],
  explanation: string,
  difficulty: string,
  createdAt: string
}

export interface CompletedQuiz {
  quizId: string;
  score: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
}

export interface QuizAttempt {
    id: string,
    quizId: string,
    userId: string,
    startedAt: string,
    completedAt: string,
    timeSpent: number,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    totalPoints: number,
    maxPoints: number,
    status: string,
    answers?: QuizAnswer[],
    quiz?: Quiz
}

export interface QuizUserStatistics {
  totalAttempts: number,
  completedAttempts: number,
  completionRate: number,
  averageScore: number,
  averageTimeSpent: number
}

export interface QuizState {
  quizUserStatistics: QuizUserStatistics;
  // General quiz state
  availableQuizzes: Quiz[];
  quiz: Quiz | null;
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: QuizAnswer[];
  isActive: boolean;
  error: string | null;
  timeRemaining: number;
  isLoading: boolean;
  completedQuizzes: CompletedQuiz[];
  currentQuizAttempt: QuizAttempt | null;
  currentQuizAttemptComplete: QuizAttempt;
  // Loading states
  isLoadingQuizzes: boolean;
  
  // Categorized quizzes
  quizzesBySubject: Record<string, Quiz[]>;
  quizzesByChapter: Record<string, Quiz[]>;
  
  // Pagination
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface QuizAnswer {
    quizAttemptId?: string,
    questionId?: string,
    selectedOption?: string | number,
    textAnswer?: string,
    isCorrect?: boolean,
    pointsEarned?: number,
    timeSpent?: number,
    answeredAt?: string,
    question?: Question
}