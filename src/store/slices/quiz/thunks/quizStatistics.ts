import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const quizStatistics = createAsyncThunk(
    'quiz/quizStatistics',
    async (userId: string | undefined, { rejectWithValue, getState }) => {
      try {
        const state = getState() as any;
        // Use provided userProfileId or get from auth state
         userId = userId || state.auth.user?.id || '0016e789-b406-46a5-bf04-0cca30fea38e';
        console.log("Fetching quiz statistics for user:", userId);
        console.log("Auth state:", state.auth);
        const statistics = await quizService.quizStatistics(userId as any);
        console.log("Quiz statistics response:", statistics);
        return statistics;
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz statistics');
      }
    }
  );

  export const extraReducersQuizStatistics = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(quizStatistics.pending, (state) => {
        state.isLoading = true;  
        state.error = null;
      })
      .addCase(quizStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quizUserStatistics = action.payload;
      })
      .addCase(quizStatistics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };