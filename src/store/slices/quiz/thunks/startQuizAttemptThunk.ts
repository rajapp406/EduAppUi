import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const startQuizAttempt = createAsyncThunk(
    'quiz/quizAttempt',
    async (quizId: string, { rejectWithValue }) => {
      try {
        const quiz = await quizService.getQuizAttempt(quizId);
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
        console.log("action.payload", action.payload)
        state.currentQuizAttempt = action.payload;
      })
      .addCase(startQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };