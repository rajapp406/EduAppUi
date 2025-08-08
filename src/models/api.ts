// Enums
export interface AnswerOption {
  explanation: string;
  text: string;
  isCorrect: boolean;
}
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

// Request DTOs
export interface CreateQuizRequest {
  title: string;
  type: QuizType;
  grade: number;
  board?: Board;
  subjectId?: string;
  timeLimit?: number;
  questionIds?: string[];
}

export interface UpdateQuizRequest {
  title?: string;
  type?: QuizType;
  grade?: number;
  board?: Board;
  subjectId?: string | null;
  timeLimit?: number | null;
  questionIds?: string[];
}

export interface CreateQuestionRequest {
  chapterId: string;
  subjectId: string;
  grade: number;
  board: Board;
  questionType: QuestionType;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: Difficulty;
}

export interface UpdateQuestionRequest {
  chapterId?: string;
  subjectId?: string;
  grade?: number;
  board?: Board;
  questionType?: QuestionType;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: Difficulty;
}

// Response DTOs
export interface Quiz {
  id: string;
  title: string;
  description: string;
  type: QuizType;
  timeLimit: number;
  createdById: string;
  createdByRole: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isPublic: boolean;
  primaryGrade?: number;
  primaryBoard?: Board;
  primarySubjectId?: string | null;
  hasMultipleGrades?: boolean;
  hasMultipleBoards?: boolean;
  hasMultipleSubjects?: boolean;
  questionCount?: number;
  averageDifficulty?: Difficulty;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
  primarySubject?: {
    id: string;
    name: string;
    grade: number;
    board: Board;
    iconUrl?: string;
  };
  questions: Array<QuestionResponse>;
  _count?: {
    attempts: number;
    questions: number;
  };
  attemptCount?: number;
}

export interface QuestionResponse {
  id: string;
  chapterId?: string;
  subjectId?: string;
  grade?: number;
  board?: Board;
  questionType: QuestionType;
  questionText: string;
  options: AnswerOption[];
  explanation: string | null;
  difficulty: Difficulty;
  createdAt: string;
  updatedAt?: string;
  chapter?: {
    id: string;
    title: string;
  };
  subject?: {
    id: string;
    name: string;
    grade?: number;
    board?: Board;
    iconUrl?: string;
  };
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  studentId: string;
  quiz: Quiz;
  score: number;
  totalMarks: number;
  percentage: number;
  timeSpent: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  completedAt?: string;
  answers: QuizAnswerResponse[];
  correctAnswers: number;
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswerResponse {
  id: string;
  attemptId: string;
  questionId: string;
  question: QuestionResponse;
  selectedOption?: string | number | Record<string, any>;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
  answeredAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
  timestamp?: string;
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
