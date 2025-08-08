import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subjectService } from '@/services/subjectService';
import { Subject, SubjectState } from '@/models/subject';

// Async thunk to fetch quiz by ID
export const fetchSubject = createAsyncThunk(
  'subject/fetchSubject',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const subject = await subjectService.getSubjectById(subjectId);
      return subject;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
    }
  }
);
export const loadSubjectsAsync = createAsyncThunk(
  'subject/loadSubjects',
  async (_, { rejectWithValue }) => {
    try {
      console.log('loadSubjectsAsync: Fetching subjects from service...');
      const subjects = await subjectService.getAllSubjects();
      console.log('loadSubjectsAsync: Successfully fetched subjects:', subjects);
      return subjects;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch quizzes';
      console.error('loadQuizzesAsync error:', errorMessage, error);
      return rejectWithValue(errorMessage);
    }
  }
);
const initialState: SubjectState = {
  availableSubjects: [],
  currentSubject: null,
  isLoading: false,
  error: null,
};

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    resetSubjectState: (state) => {
      state.currentSubject = null;
      state.isLoading = false;
      state.error = null;
    },
    loadSubjects: (state, action: PayloadAction<Subject[]>) => {
      console.log("loadSubjects", action, state);
        state.availableSubjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loadSubjectsAsync.pending, (state) => {
        state.isLoading = true;
        console.log("loadSubjectsAsync.pending", state);
        state.error = null;
      })
      .addCase(loadSubjectsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("loadSubjectsAsync.fulfilled", action.payload);
        state.availableSubjects = action.payload;
      })
      .addCase(loadSubjectsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetSubjectState,
  loadSubjects,
} = subjectSlice.actions;
export default subjectSlice.reducer;