import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { answerQuestion, nextQuestion, previousQuestion, submitQuiz } from '../../store/slices/quiz/quizSlice';
import { earnCredits } from '../../store/slices/creditSlice';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';
import { QuestionComponent } from '../reusable/QuestionComponent';
import { Loader2 } from 'lucide-react';
import { Quiz } from '@/models/api';
import { submitQuizAttempt } from '@/store/slices/quiz/thunks/submitQuizThunk';
import { QuizAnswer } from '@/models/quiz';

interface QuizTakingProps {
  onQuizComplete: () => void;
  currentQuiz: Quiz | null
}

const QuizTaking: React.FC<QuizTakingProps> = ({ currentQuiz, onQuizComplete }) => {
  const dispatch = useAppDispatch();
  const { currentQuizAttempt, currentQuestionIndex, userAnswers, timeRemaining, isLoading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const [showResults, setShowResults] = useState(false);

  // Remove the fetchQuiz call from QuizTaking since it's handled by the parent component
  // The quiz data should already be available from the parent component

  // Show loading state
  if (isLoading || !currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error loading quiz: {error}</p>
      </div>
    );
  }
console.log(currentQuizAttempt, 'currentQuizAttemptcurrentQuizAttempt')
  // Add null checks for questions array
  const questions = currentQuiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  
  if (!currentQuestion || totalQuestions === 0) {
    return (
      <div className="p-4 text-yellow-600 bg-yellow-50 rounded-md">
        No questions available for this quiz.
      </div>
    );
  }

  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
console.log(userAnswers, 'userAnswersuserAnswers')
  const handleAnswerSelect = (answer: string | number) => {
    const quizAnswer: QuizAnswer = {
      quizAttemptId: currentQuizAttempt?.id || '',
      questionId: currentQuestion.id,
      selectedOption: answer,
      textAnswer: '',
      timeSpent: 0
    };
    dispatch(answerQuestion({ questionIndex: currentQuestionIndex, answer: quizAnswer }));
  };

  const handleSubmit = () => {
    console.log("handleSubmit", currentQuizAttempt)
    dispatch(submitQuizAttempt(userAnswers as any));
    onQuizComplete();

    // Calculate score and award bonus credits
    const correctAnswers = userAnswers.filter((answer, index) =>
      answer.selectedOption === currentQuiz.questions[index].options.find((option) => option.isCorrect)?.text
    ).length;
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    if (score >= 80) {
      dispatch(earnCredits({ amount: 5, description: 'High score bonus' }));
    }

    setShowResults(true);
  };

  if (showResults) {
    const correctAnswers = userAnswers.filter((answer, index) =>
      answer.selectedOption === currentQuiz.questions[index].options.find((option) => option.isCorrect)?.text
    ).length;
    const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 80 ? 'bg-green-100 text-green-600' :
                  score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                }`}>
                <Flag className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600">Great job completing the quiz</p>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">{score}%</div>
              <p className="text-lg text-gray-600">
                {correctAnswers} out of {currentQuiz.questions.length} correct
              </p>
              {score >= 80 && (
                <p className="text-green-600 font-medium mt-2">
                  🎉 Bonus: +5 credits for excellent performance!
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button variant="primary" onClick={onQuizComplete}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h2>
          <div className="flex items-center space-x-2 text-lg font-mono">
            <Clock className="h-5 w-5 text-red-500" />
            <span className={timeRemaining < 60 ? 'text-red-500' : 'text-gray-600'}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mb-2">
          <ProgressBar progress={progress} showLabel />
        </div>

        <p className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
        </p>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <QuestionComponent
          currentQuestion={currentQuestion}
          userAnswers={userAnswers}
          currentQuestionIndex={currentQuestionIndex}
          handleAnswerSelect={handleAnswerSelect} />
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => dispatch(previousQuestion())}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex space-x-3">
          {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={userAnswers[currentQuestionIndex] === null}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => dispatch(nextQuestion())}
              disabled={userAnswers[currentQuestionIndex] === null}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;