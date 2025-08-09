import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
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
  export const extraReducersLoadQuizzesBySubject = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(loadQuizzesBySubject.pending, (state) => {
        state.isLoadingQuizzes = true;  
        state.error = null;
      })
      .addCase(loadQuizzesBySubject.fulfilled, (state, action) => {
        const { items, subjectId } = action.payload;
        console.log('loadQuizzesBySubject: Successfully loaded quizzes:', {
          items,
          hasData: !!action.payload,
          meta: action.payload?.meta,
          subjectId
        });
        state.isLoadingQuizzes = false;
        if (subjectId) {
          state.quizzesBySubject[subjectId] = items;
        } else {
          state.availableQuizzes = items;
        }
      })
      .addCase(loadQuizzesBySubject.rejected, (state, action) => {
        state.isLoadingQuizzes = false;
        state.error = action.payload as string;
      });
  };