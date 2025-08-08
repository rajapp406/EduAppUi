import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionState } from '@/models/question';
import { questionService } from '@/services/questionService';

// Async thunk to fetch chapter by ID
export const fetchQuestion = createAsyncThunk(
  'question/fetchQuestion',
  async ({subjectId, chapterId}: {subjectId: string, chapterId: string}, { rejectWithValue }) => {
    try {
      const question = await questionService.getAllQuestions(subjectId, chapterId);
      return question;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch chapter');
    }
  }
);

// Async thunk to load all chapters for a subject
export const loadQuestionsAsync = createAsyncThunk(
  'question/loadQuestionsBySubjectId',
  async ({subjectId, chapterId}: {subjectId: string, chapterId: string}, { rejectWithValue }) => {
    try {
      console.log('Loading questions for subject ID:', subjectId);
      const questions = await questionService.getAllQuestions(subjectId, chapterId);
      console.log('Successfully loaded questions:', questions);
      return questions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch questions';
      console.error('loadChaptersBySubjectId error:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Kept for backward compatibility
const initialState: QuestionState = {
  availableQuestions: [],
  currentQuestion: null,
  isLoading: false,
  error: null,
};

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    resetquestionState: (state) => {
      state.currentQuestion = null;
      state.isLoading = false;
      state.error = null;
    },
    loadquestions: (state, action: PayloadAction<Question[]>) => {
      console.log("loadquestions", action, state);
        state.availableQuestions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableQuestions = action.payload;
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loadQuestionsAsync.pending, (state) => {
        state.isLoading = true;
        console.log("loadChaptersAsync.pending", state);
        state.error = null;
      })
      .addCase(loadQuestionsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("loadChaptersAsync.fulfilled", action.payload);
        state.availableQuestions = action.payload;
      })
      .addCase(loadQuestionsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetquestionState,
  loadquestions,
} = questionSlice.actions;
export default questionSlice.reducer;