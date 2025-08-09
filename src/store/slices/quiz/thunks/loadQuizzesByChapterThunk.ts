import { QuizState } from "@/models/quiz";
import { quizService } from "@/services/quizService";
import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";  
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
  
  export const extraReducersLoadQuizzesByChapter = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(loadQuizzesByChapter.pending, (state) => {
        state.isLoadingQuizzes = true;  
        state.error = null;
      })
      .addCase(loadQuizzesByChapter.fulfilled, (state, action) => {
        state.isLoadingQuizzes = false;
        state.availableQuizzes = action.payload.items;
      })
      .addCase(loadQuizzesByChapter.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      });
  };