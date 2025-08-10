import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizService } from "@/services/quizService";
import { QuizAnswer, QuizState } from "@/models/quiz";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

export const submitQuizAttempt = createAsyncThunk(
    'quiz/submitQuizAttempt',
    async (_, { rejectWithValue, getState }) => {
      try {
        const state = await getState() as any;
        console.log(state.quiz.currentQuizAttempt.id, 'state.submitQuizAttempt')
        const quizAnswers = state.quiz.userAnswers.map((answer: QuizAnswer) => ({
          questionId: answer.questionId,
          selectedOption: answer.selectedOption,
          textAnswer: answer.textAnswer,
          timeSpent: answer.timeSpent
        }));
        const quizAttempt = await quizService.submitQuizAttempt(state.quiz.currentQuizAttempt.id, quizAnswers);
        return quizAttempt;
      } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch quiz');
      }
    }
  );

  export const extraReducersSubmitQuizAttempt = (builder: ActionReducerMapBuilder<QuizState>) => {
    builder
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isLoading = false;  
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        //state.currentQuizAttempt = action.payload;
        console.log(state.currentQuiz, 'state.state.submitQuizAttempt lll')
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
        }  
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  };