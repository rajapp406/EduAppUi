import { QuizState } from "@/models/quiz";

export const initialState: QuizState = {
    availableQuizzes: [],
    currentQuiz: null,
    currentQuestionIndex: 0,
    currentQuizAttempt: null,
    userAnswers: [],
    isActive: false,
    isLoading: false,
    isLoadingQuizzes: false,
    error: null,
    timeRemaining: 0,
    completedQuizzes: [],
    quizzesBySubject: {},
    quizzesByChapter: {},
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasMore: false
    }
  };