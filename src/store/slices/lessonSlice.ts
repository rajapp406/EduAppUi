import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  videoUrl: string;
  creditCost: number;
  completed: boolean;
  progress: number;
}

interface LessonState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  watchHistory: {
    lessonId: string;
    watchedAt: string;
    duration: number;
  }[];
}

const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    description: 'Learn the basics of algebraic expressions and equations',
    duration: 1800,
    difficulty: 'beginner',
    subject: 'Mathematics',
    videoUrl: 'https://www.youtube.com/embed/NybHckSEQBI',
    creditCost: 3,
    completed: false,
    progress: 0,
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    description: 'Understanding the three fundamental laws of physics',
    duration: 2400,
    difficulty: 'intermediate',
    subject: 'Physics',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
    creditCost: 5,
    completed: false,
    progress: 0,
  },
  {
    id: '3',
    title: 'Chemical Bonding',
    description: 'Explore how atoms combine to form compounds',
    duration: 2100,
    difficulty: 'intermediate',
    subject: 'Chemistry',
    videoUrl: 'https://www.youtube.com/embed/QqjcCvzWwww',
    creditCost: 4,
    completed: false,
    progress: 0,
  },
];

const initialState: LessonState = {
  lessons: sampleLessons,
  currentLesson: null,
  watchHistory: [],
};

const lessonSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    startLesson: (state, action: PayloadAction<string>) => {
      const lesson = state.lessons.find(l => l.id === action.payload);
      if (lesson) {
        state.currentLesson = lesson;
      }
    },
    completeLesson: (state, action: PayloadAction<string>) => {
      const lesson = state.lessons.find(l => l.id === action.payload);
      if (lesson) {
        lesson.completed = true;
        lesson.progress = 100;
        state.watchHistory.push({
          lessonId: action.payload,
          watchedAt: new Date().toISOString(),
          duration: lesson.duration,
        });
      }
    },
    updateProgress: (state, action: PayloadAction<{ lessonId: string; progress: number }>) => {
      const lesson = state.lessons.find(l => l.id === action.payload.lessonId);
      if (lesson) {
        lesson.progress = action.payload.progress;
      }
    },
  },
});

export const { startLesson, completeLesson, updateProgress } = lessonSlice.actions;
export default lessonSlice.reducer;