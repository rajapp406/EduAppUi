import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizAnswer, QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const submitQuizAttempt = createAsyncThunk(
    'quiz/submitQuizAttempt',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = getState() as any;
        const quizAnswers = state.quiz.userAnswers.map((answer: QuizAnswer) => ({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          textAnswer: answer.textAnswer,
          timeSpent: answer.timeSpent
        }));
        const quizAttempt = await quizService.submitQuizAttempt(state.quiz.currentQuizAttempt?.id || '', quizAnswers);
        return quizAttempt;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );

  export const extraReducersSubmitQuizAttempt = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isLoading = true;  
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };