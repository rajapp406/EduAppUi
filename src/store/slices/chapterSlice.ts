import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chapter, ChapterState } from '@/models/chapter';
import { chapterService } from '@/services/chapterService';

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

// Kept for backward compatibility
export const loadChaptersAsync = loadChaptersBySubjectIdAsync;
const initialState: ChapterState = {
  availableChapters: [],
  currentChapter: null,
  isLoading: false,
  error: null,
};

const chapterSlice = createSlice({
  name: 'chapter',
  initialState,
  reducers: {
    resetchapterState: (state) => {
      state.currentChapter = null;
      state.isLoading = false;
      state.error = null;
    },
    loadchapters: (state, action: PayloadAction<Chapter[]>) => {
      console.log("loadchapters", action, state);
        state.availableChapters = action.payload;
    },
  },
  extraReducers: (builder) => {
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
      .addCase(loadChaptersAsync.pending, (state) => {
        state.isLoading = true;
        console.log("loadChaptersAsync.pending", state);
        state.error = null;
      })
      .addCase(loadChaptersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("loadChaptersAsync.fulfilled", action.payload);
        state.availableChapters = action.payload;
      })
      .addCase(loadChaptersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetchapterState,
  loadchapters,
} = chapterSlice.actions;
export default chapterSlice.reducer;