import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chapter, ChapterState } from '@/models/chapter';
import { loadChaptersBySubjectIdAsync } from './thunks/loadChaptersBySubjectIdthunk';
import { fetchChapter } from './thunks/fetchChapterThunk';
import { extraReducersChapter } from './thunks/index';


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
  extraReducers: extraReducersChapter 
});

export const { 
  resetchapterState,
  loadchapters,
} = chapterSlice.actions;
export default chapterSlice.reducer;