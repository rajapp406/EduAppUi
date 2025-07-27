import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import quizSlice from './slices/quizSlice';
import lessonSlice from './slices/lessonSlice';
import creditSlice from './slices/creditSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    quiz: quizSlice,
    lessons: lessonSlice,
    credits: creditSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;