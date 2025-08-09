import { createAsyncThunk } from "@reduxjs/toolkit";
import { chapterService } from "@/services/chapterService";
import { ChapterState } from "@/models/chapter";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

// Async thunk to load all chapters for a subject
export const loadChaptersBySubjectIdAsync = createAsyncThunk(
    'chapter/loadChaptersBySubjectId',
    async (subjectId: string, { rejectWithValue }) => {
      try {
        console.log('Loading chapters for subject ID:', subjectId);
        const chapters = await chapterService.getChaptersBySubject(subjectId);
        console.log('Successfully loaded chapters:', chapters);
        return chapters;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chapters';
        console.error('loadChaptersBySubjectId error:', errorMessage, error);
        return rejectWithValue(errorMessage);
      }
    }
  );
  
export const extraReducersLoadChaptersBySubjectIdAsync = (builder: ActionReducerMapBuilder<ChapterState>) => {
    builder.addCase(loadChaptersBySubjectIdAsync.pending, (state) => {
    state.isLoading = true;
    console.log("loadChaptersAsync.pending", state);
    state.error = null;
  })
  .addCase(loadChaptersBySubjectIdAsync.fulfilled, (state, action) => {
    state.isLoading = false;
    console.log("loadChaptersAsync.fulfilled", action.payload);
    state.availableChapters = action.payload;
  })
  .addCase(loadChaptersBySubjectIdAsync.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  });   
}