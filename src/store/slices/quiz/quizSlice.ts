import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizAnswer, QuizState } from '@/models/quiz';
import { Quiz } from '@/models/api';
import { extraReducersQuiz } from './thunks';
import { initialState } from './initialState';


const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetQuizState: (state) => {
      state.currentQuiz = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.isActive = false;
      state.isLoading = false;
      state.error = null;
      state.timeRemaining = 0;
    },
    loadQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      console.log("loadQuizzes", action, state);
        state.availableQuizzes = action.payload;
    },
    startQuiz: (state, action: PayloadAction<string>) => {
      const quiz = state.availableQuizzes.find(q => q.id === action.payload);
      console.log('Starting quiz:', action.payload, 'Found quiz:', !!quiz);
      if (quiz) {
        state.currentQuiz = quiz;
        state.quiz = quiz; // Also set the quiz property
        state.currentQuestionIndex = 0;
        // Initialize userAnswers array with the correct length
        state.userAnswers = new Array(quiz.questions.length).fill(null);
        state.isActive = true;
        state.timeRemaining = quiz.timeLimit || 1800; // Default 30 minutes
        console.log('Quiz started successfully. Questions:', quiz.questions.length);
      } else {
        console.error('Quiz not found in availableQuizzes:', action.payload);
      }
    },
    answerQuestion: (state, action: PayloadAction<{ questionIndex: number; answer: QuizAnswer }>) => {
    console.log(state, action, state.userAnswers)
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
          answer.selectedOption === state.currentQuiz!.questions[index].options.find((option) => option.isCorrect)?.text
        ).length;
        const totalQuestions = state.currentQuiz.questions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        state.completedQuizzes.push({
          quizId: state.currentQuiz.id,
          score,
          completedAt: new Date().toISOString(),
          totalQuestions,
          correctAnswers,
        });
        
        // Keep currentQuiz and userAnswers for the results page
        state.isActive = false;
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
  extraReducers: extraReducersQuiz
});

export const { 
  startQuiz, 
  answerQuestion, 
  nextQuestion, 
  previousQuestion, 
  submitQuiz, 
  updateTimer,
  resetQuizState,
  loadQuizzes,
} = quizSlice.actions;
export default quizSlice.reducer;