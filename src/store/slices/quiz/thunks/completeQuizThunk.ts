import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizAnswer, QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const completeQuizAttempt = createAsyncThunk(
    'quiz/completeQuizAttempt',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState() as any;
        console.log(state.quiz, 'state.completeQuizAttempt')
        const quizAttempt = await quizService.quizComplete(state.quiz.currentQuizAttempt?.id || '');
        return quizAttempt;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );

  export const extraReducersCompleteQuizAttempt = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(completeQuizAttempt.pending, (state) => {
        state.isLoading = true;  
        state.error = null;
      })
      .addCase(completeQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        (state as any).currentQuizAttemptComplete = action.payload;
      })
      .addCase(completeQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };