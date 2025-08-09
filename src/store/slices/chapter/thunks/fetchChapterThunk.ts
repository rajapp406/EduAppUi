import { createAsyncThunk } from "@reduxjs/toolkit";
import { chapterService } from "@/services/chapterService";
import { ChapterState } from "@/models/chapter";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

// Async thunk to fetch chapter by ID
export const fetchChapter = createAsyncThunk(
    'chapter/fetchChapter',
    async (chapterId: string, { rejectWithValue }) => {
      try {
        const chapter = await chapterService.getChapterById(chapterId);
        return chapter;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch chapter');
      }
    }
  );

  export const extraReducersFetchChapter = (builder: ActionReducerMapBuilder<ChapterState>) => {
      builder
      .addCase(fetchChapter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChapter = action.payload;
      })
      .addCase(fetchChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
    }   