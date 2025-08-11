import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { QuizState } from '@/models/quiz';
import { Quiz, QuizType } from '@/models/api';
import { quizService } from '@/services/quizService';

// Async thunk to fetch quiz by ID
export const fetchQuiz = createAsyncThunk(
  'quiz/fetchQuiz',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const quiz = await quizService.getQuizById(quizId);
      return quiz;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
    }
  }
);

export const startQuizAttempt = createAsyncThunk(
  'quiz/quizAttempt',
  async (quizId: string, { rejectWithValue, getState }) => {
    const state = getState() as any;
    // Use provided userProfileId or get from auth state
     const userId =  state.auth.user?.id || '0016e789-b406-46a5-bf04-0cca30fea38e';
    console.log(userId, 'userIduserIduserId')
    try {
      const quiz = await quizService.getQuizAttempt(quizId, userId);
      return quiz;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
    }
  }
);

// Async thunk to load all quizzes
export const loadQuizzesAsync = createAsyncThunk(
  'quiz/loadQuizzes',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      console.log('loadQuizzesAsync: Fetching all quizzes...', params);
      const response = await quizService.getQuizzes({
        page: params.page || 1,
        limit: params.limit || 10
      });
      console.log('loadQuizzesAsync: Successfully fetched quizzes:', response);
      return {
        items: response || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes';
      console.error('loadQuizzesAsync error:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to load quizzes by subject
export const loadQuizzesBySubject = createAsyncThunk(
  'quiz/loadQuizzesBySubject',
  async (params: { subjectId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log('loadQuizzesBySubject: Fetching quizzes for subject:', params);
      const response = await quizService.getQuizzesBySubject(
        params.subjectId,
        params.page || 1,
        params.limit || 10
      );
      console.log('loadQuizzesBySubject: Successfully fetched quizzes:', {
        response,
        hasData: !!response,
        meta: response?.meta,
        subjectId: params.subjectId
      });
      
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response data format:', response);
        return {
          items: [],
          meta: response?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
          subjectId: params.subjectId
        };
      }
      
      return {
        items: response,
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        subjectId: params.subjectId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes by subject';
      console.error('loadQuizzesBySubject error:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to load quizzes by chapter
export const loadQuizzesByChapter = createAsyncThunk(
  'quiz/loadQuizzesByChapter',
  async (params: { chapterId: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log('loadQuizzesByChapter: Fetching quizzes for chapter:', params);
      const response = await quizService.getQuizzesByChapter(
        params.chapterId,
        params.page || 1,
        params.limit || 10
      );
      console.log('loadQuizzesByChapter: Successfully fetched quizzes:', response);
      return {
        items: response.data || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        chapterId: params.chapterId
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes by chapter';
      console.error('loadQuizzesByChapter error:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState: QuizState = {
  availableQuizzes: [],
  currentQuiz: null,
  currentQuestionIndex: 0,
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

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuizState: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isActive = false;
      state.isLoading = false;
      state.error = null;
      state.timeRemaining = 0;
    },
    loadQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      console.log("loadQuizzes", action, state);
        state.availableQuizzes = action.payload;
    },
    startQuiz: (state, action: PayloadAction<string>) => {
      const quiz = state.availableQuizzes.find(q => q.id === action.payload);
      if (quiz) {
        state.currentQuiz = quiz;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.isActive = true;
        state.timeRemaining = quiz.timeLimit;
      }
    },
    answerQuestion: (state, action: PayloadAction<{ questionIndex: number; answer: string | number }>) => {
    console.log(state, action, state.userAnswers)
      state.userAnswers[action.payload.questionIndex] = action.payload.answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    submitQuiz: (state) => {
      if (state.currentQuiz) {
        const correctAnswers = state.userAnswers.filter((answer, index) => 
          answer === state.currentQuiz!.questions[index].options.find((option) => option.isCorrect)?.text
        ).length;
        const totalQuestions = state.currentQuiz.questions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        state.completedQuizzes.push({
          quizId: state.currentQuiz.id,
          score,
          completedAt: new Date().toISOString(),
          totalQuestions,
          correctAnswers,
        });
        
        // Keep currentQuiz and userAnswers for the results page
        state.isActive = false;
        state.timeRemaining = 0;
      }
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else if (state.isActive) {
        // Auto-submit when time runs out
        quizSlice.caseReducers.submitQuiz(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  builder
      .addCase(startQuizAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(startQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(loadQuizzesAsync.pending, (state) => {
        state.isLoadingQuizzes = true;
        state.error = null;
      })
      .addCase(loadQuizzesAsync.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        console.log("loadQuizzesAsync", action, state);
        state.availableQuizzes = action.payload.items;
        console.log("availableQuizzes", state.availableQuizzes);
        if (action.payload.meta) {
          state.pagination = {
            page: action.payload.meta.page,
            limit: action.payload.meta.limit,
            total: action.payload.meta.total,
            totalPages: action.payload.meta.totalPages,
            hasMore: action.payload.meta.page < action.payload.meta.totalPages
          };
        }
      })
      .addCase(loadQuizzesAsync.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      })
      
      .addCase(loadQuizzesBySubject.pending, (state) => {
        state.isLoadingQuizzes = true;
        state.error = null;
      })
      .addCase(loadQuizzesBySubject.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        console.log("loadQuizzesBySubject fullfilled", action, state);
        if (action.payload.subjectId) {
          state.quizzesBySubject[action.payload.subjectId] = action.payload.items;
          if (action.payload.meta) {
            state.pagination = {
              page: action.payload.meta.page,
              limit: action.payload.meta.limit,
              total: action.payload.meta.total,
              totalPages: action.payload.meta.totalPages,
              hasMore: action.payload.meta.page < action.payload.meta.totalPages
            };
          }
        }
      })
      .addCase(loadQuizzesBySubject.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      })
      
      .addCase(loadQuizzesByChapter.pending, (state) => {
        state.isLoadingQuizzes = true;
        state.error = null;
      })
      .addCase(loadQuizzesByChapter.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        if (action.payload.chapterId) {
          state.quizzesByChapter[action.payload.chapterId] = action.payload.items;
          state.currentQuiz = action.payload.items[0];
          console.log("currentQuiz thunk", state.currentQuiz);
          if (action.payload.meta) {
            state.pagination = {
              page: action.payload.meta.page,
              limit: action.payload.meta.limit,
              total: action.payload.meta.total,
              totalPages: action.payload.meta.totalPages,
              hasMore: action.payload.meta.page < action.payload.meta.totalPages
            };
          }
        }
      })
      .addCase(loadQuizzesByChapter.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  startQuiz, 
  answerQuestion, 
  nextQuestion, 
  previousQuestion, 
  submitQuiz, 
  updateTimer,
  resetQuizState,
  loadQuizzes,
} = quizSlice.actions;
export default quizSlice.reducer;