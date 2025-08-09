import { Quiz } from "./api";
interface AnswerOption {
  explanation: string;
  text: string;
  isCorrect: boolean;
}
export interface Question {
  id: string;
  questionType: 'multiple-choice' | 'true-false' | 'short-answer';
  questionText: string;
  options?: AnswerOption[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

export interface CompletedQuiz {
  quizId: string;
  score: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userProfileId: string;
  startTime: string;
  endTime: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

export interface QuizState {
  // General quiz state
  availableQuizzes: Quiz[];
  quiz: Quiz;
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: QuizAnswer[];
  isActive: boolean;
  error: string | null;
  timeRemaining: number;
  isLoading: boolean;
  completedQuizzes: CompletedQuiz[];
  currentQuizAttempt: QuizAttempt | null;
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
  quizAttemptId: string,
  questionId: string,
  selectedOption: string | number,
  textAnswer: string,
  timeSpent: number
}