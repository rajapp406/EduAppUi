import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  creditCost: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
}

interface QuizState {
  availableQuizzes: Quiz[];
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  userAnswers: (string | number | null)[];
  isActive: boolean;
  timeRemaining: number;
  completedQuizzes: {
    quizId: string;
    score: number;
    completedAt: string;
  }[];
}

const sampleQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Basic Mathematics',
    description: 'Test your fundamental math skills',
    creditCost: 5,
    difficulty: 'easy',
    subject: 'Mathematics',
    timeLimit: 600,
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'What is 15 + 27?',
        options: ['40', '42', '44', '46'],
        correctAnswer: 1,
        difficulty: 'easy',
        subject: 'Mathematics',
        explanation: '15 + 27 = 42'
      },
      {
        id: '2',
        type: 'multiple-choice',
        question: 'What is 8 × 9?',
        options: ['70', '71', '72', '73'],
        correctAnswer: 2,
        difficulty: 'easy',
        subject: 'Mathematics',
        explanation: '8 × 9 = 72'
      }
    ]
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    description: 'Basic physics concepts and formulas',
    creditCost: 8,
    difficulty: 'medium',
    subject: 'Physics',
    timeLimit: 900,
    questions: [
      {
        id: '3',
        type: 'multiple-choice',
        question: 'What is the unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1,
        difficulty: 'medium',
        subject: 'Physics',
        explanation: 'Newton is the SI unit of force'
      }
    ]
  }
];

const initialState: QuizState = {
  availableQuizzes: sampleQuizzes,
  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  isActive: false,
  timeRemaining: 0,
  completedQuizzes: [],
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<string>) => {
      const quiz = state.availableQuizzes.find(q => q.id === action.payload);
      if (quiz) {
        state.currentQuiz = quiz;
        state.currentQuestionIndex = 0;
        state.userAnswers = new Array(quiz.questions.length).fill(null);
        state.isActive = true;
        state.timeRemaining = quiz.timeLimit;
      }
    },
    answerQuestion: (state, action: PayloadAction<{ questionIndex: number; answer: string | number }>) => {
      state.userAnswers[action.payload.questionIndex] = action.payload.answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    submitQuiz: (state) => {
      if (state.currentQuiz) {
        const correctAnswers = state.userAnswers.filter((answer, index) => 
          answer === state.currentQuiz!.questions[index].correctAnswer
        ).length;
        const score = Math.round((correctAnswers / state.currentQuiz.questions.length) * 100);
        
        state.completedQuizzes.push({
          quizId: state.currentQuiz.id,
          score,
          completedAt: new Date().toISOString(),
        });
        
        state.currentQuiz = null;
        state.isActive = false;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.timeRemaining = 0;
      }
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else if (state.isActive) {
        // Auto-submit when time runs out
        quizSlice.caseReducers.submitQuiz(state);
      }
    },
  },
});

export const { startQuiz, answerQuestion, nextQuestion, previousQuestion, submitQuiz, updateTimer } = quizSlice.actions;
export default quizSlice.reducer;