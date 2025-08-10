import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const startQuizAttempt = createAsyncThunk(
    'quiz/quizAttempt',
    async (quizId: string, { rejectWithValue, getState }) => {
      const state = getState() as any;
      const userId = state.auth.user?.id || '0016e789-b406-46a5-bf04-0cca30fea38e';
      try {
        const quiz = await quizService.getQuizAttempt(quizId, userId);
        return quiz;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );
  export const getQuizAttemptById = createAsyncThunk(
    'quiz/quizAttemptById',
    async (quizId: string, { rejectWithValue, getState }) => {
      const state = getState() as any;
      const userId = state.auth.user?.id || '0016e789-b406-46a5-bf04-0cca30fea38e';
      try {
        const quiz = await quizService.getQuizAttemptById(quizId);
        return quiz;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );
  export const extraReducersStartQuizAttempt = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(startQuizAttempt.pending, (state) => {
        state.isLoading = true;  
        state.error = null;
      })
      .addCase(startQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuizAttempt = action.payload;
      })
      .addCase(startQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };
  
  export const extraReducersGetQuizAttemptById = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(getQuizAttemptById.pending, (state) => {
        state.isLoading = true;  
        state.error = null;
      })
      .addCase(getQuizAttemptById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuizAttempt = action.payload;
      })
      .addCase(getQuizAttemptById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };