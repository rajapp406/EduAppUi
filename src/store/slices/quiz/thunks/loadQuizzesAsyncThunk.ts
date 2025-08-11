import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

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
  
  export const extraReducersLoadQuizzesAsync = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(loadQuizzesAsync.pending, (state) => {
        state.isLoadingQuizzes = true;  
        state.error = null;
      })
      .addCase(loadQuizzesAsync.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        state.availableQuizzes = action.payload.items as any;
      })
      .addCase(loadQuizzesAsync.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      });
  };        