import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const fetchQuiz = createAsyncThunk(
    'quiz/fetchQuiz',
    async (quizId: string, { getState, rejectWithValue }) => {
      try {
        const quiz = await quizService.getQuizById(quizId);
        return quiz;
      } catch (error) {
        console.error('Error in fetchQuiz:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );

export const extraReducersFetchQuiz = (builder: ActionReducerMapBuilder<QuizState>) => {
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
};