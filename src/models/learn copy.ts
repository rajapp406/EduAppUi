// Enums
export enum Board {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  IB = 'IB',
  STATE = 'STATE',
  CAMBRIDGE = 'CAMBRIDGE'
}

export enum QuizType {
  SYSTEM = 'SYSTEM',
  USER_CREATED = 'USER_CREATED',
  CHAPTER = 'CHAPTER',
  SUBJECT = 'SUBJECT',
  MIXED = 'MIXED',
  EXAM_SHEET = 'EXAM_SHEET',
  TIME_CHALLENGE = 'TIME_CHALLENGE'
}

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  SHORT_ANSWER = 'SHORT_ANSWER',
  MATCH_FOLLOWING = 'MATCH_FOLLOWING'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

// Core Interfaces
export interface Subject {
  id: string;
  name: string;
  code?: string;
  grade: number;
  board: Board;
  iconUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  chapterNumber: number;
  content?: string;
  youtubeUrl?: string;
  grade: number;
  board: Board;
  subject?: Pick<Subject, 'id' | 'name'>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  questionType: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer: string | number | Record<string, any>;
  explanation?: string;
  difficulty: Difficulty;
  marks?: number;
  chapterId?: string;
  subjectId: string;
  grade: number;
  board: Board;
  chapter?: Pick<Chapter, 'id' | 'title'>;
  subject?: Pick<Subject, 'id' | 'name'>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  type: QuizType;
  grade: number;
  board: Board;
  subjectId?: string;
  subject?: Pick<Subject, 'id' | 'name'>;
  chapterIds?: string[];
  chapters?: Array<Pick<Chapter, 'id' | 'title' | 'chapterNumber'>>;
  questionCount?: number;
  timeLimit?: number; // in minutes
  difficulty: Difficulty;
  isPublic?: boolean;
  createdById?: string;
  createdByRole?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  questions?: Question[];
  tags?: string[];
  pointsReward?: number;
  averageScore?: number;
  attemptCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  quiz: Quiz;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: number; // in seconds
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  answers: QuizAnswer[];
  correctAnswers: number;
  totalQuestions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  question: Question;
  selectedOption?: string | number | Record<string, any>;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
  answeredAt: string;
  createdAt?: string;
}

// Request/Response DTOs
export interface CreateQuizRequest {
  title: string;
  description?: string;
  type: QuizType;
  grade: number;
  board: Board;
  subjectId?: string;
  chapterIds?: string[];
  questionCount?: number;
  timeLimit?: number;
  difficulty: Difficulty;
  isPublic?: boolean;
  tags?: string[];
}

export interface SubmitQuizRequest {
  quizId: string;
  answers: Array<{
    questionId: string;
    selectedOption: string | number | Record<string, any>;
    timeSpent: number;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter Types
export interface QuizFilter {
  grade?: number;
  board?: Board;
  subjectId?: string;
  chapterId?: string;
  type?: QuizType;
  difficulty?: Difficulty;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

// Utility Types
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
};

// Component Props
export interface QuizCardProps {
  quiz: Quiz;
  onStart?: (quizId: string) => void;
  onViewResults?: (attemptId: string) => void;
  showActions?: boolean;
  className?: string;
}

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: string | number | Record<string, any>;
  onOptionSelect?: (option: string | number | Record<string, any>) => void;
  showAnswer?: boolean;
  disabled?: boolean;
  className?: string;
}

// State Types
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string | number | Record<string, any>>;
  timeSpent: Record<string, number>; // questionId -> seconds
  status: 'idle' | 'in-progress' | 'submitting' | 'completed' | 'error';
  error?: string;
  result?: QuizAttempt;
}

// Hook Types
export interface UseQuizOptions {
  autoStart?: boolean;
  onComplete?: (result: QuizAttempt) => void;
  onError?: (error: Error) => void;
}
