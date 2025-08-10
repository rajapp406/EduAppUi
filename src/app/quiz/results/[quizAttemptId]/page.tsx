

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import Button from '@/components/ui/Button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';
import { useParams } from 'next/navigation';
import { getQuizAttemptById, fetchQuizById } from '@/store/slices/quiz/thunks';

export default function QuizResultsPage() {
  const router = useRouter();
  const {quizAttemptId} = useParams() as {quizAttemptId: string};
  const { currentQuizAttempt, currentQuiz: separateQuiz, isLoading, error } = useSelector((state: RootState) => state.quiz);
  const dispatch = useAppDispatch();
  
  // Use embedded quiz data if available, otherwise use separately fetched quiz
  const currentQuiz = currentQuizAttempt?.quiz || separateQuiz;
  const userAnswers = currentQuizAttempt?.answers;
  
  useEffect(() => {
    if (quizAttemptId) {
      dispatch(getQuizAttemptById(quizAttemptId));
    }
  }, [dispatch, quizAttemptId]);

  // If quiz attempt is loaded but doesn't have quiz data, fetch it separately
  useEffect(() => {
    if (currentQuizAttempt && !currentQuizAttempt.quiz && currentQuizAttempt.quizId) {
      dispatch(fetchQuizById(currentQuizAttempt.quizId));
    }
  }, [dispatch, currentQuizAttempt]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Loading Quiz Results</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Results</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/quiz">
              <Button>Back to Quizzes</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  console.log('Quiz attempt data:', { 
    currentQuizAttempt, 
    currentQuiz, 
    userAnswers,
    answers: currentQuizAttempt?.answers,
    questionsCount: currentQuiz?.questions?.length,
    firstQuestion: currentQuiz?.questions?.[0],
    firstQuestionOptions: currentQuiz?.questions?.[0]?.options
  });
  
  if (!currentQuizAttempt || !currentQuiz || !currentQuiz.questions || !userAnswers) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No quiz results found</h2>
            <p className="text-gray-600 mb-4">The quiz attempt data could not be loaded.</p>
            <Link href="/quiz">
              <Button>Back to Quizzes</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { score, totalQuestions, correctAnswers } = currentQuizAttempt;

  return (
    <MainLayout>
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Results</h1>
        
        {/* Score Summary */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">{currentQuiz.title}</h2>
          <div className="text-5xl font-bold text-blue-600 my-4">{score}%</div>
          <p className="text-gray-600">
            You answered {correctAnswers} out of {totalQuestions} questions correctly
          </p>
        </div>

        {/* Questions Review */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
          <div className="space-y-6">
            {currentQuiz.questions?.map((question, index) => {
              // Debug logging for each question
              question = (question as any).question;
              
              // Find the user's answer for this question
              const userAnswerObj = userAnswers?.find(answer => answer.questionId === question.id);
              const userAnswer = userAnswerObj?.selectedOption ?? 'No answer provided';
              console.log(userAnswerObj,question, userAnswers, 'userAnswerObjuserAnswerObjuserAnswerObj')
              // Find the correct answer
              const correctOption = question.options?.find((option) => option.isCorrect);
              const correctAnswer = correctOption?.text;
              
              // Check if the user's answer is correct
              const isCorrect = userAnswer === correctAnswer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">
                        Question {index + 1}: {question.questionText}
                      </h3>
                      
                      {/* Display all options with indicators */}
                      <div className="mt-3 space-y-2">
                        {question.options && question.options.length > 0 && question.questionType !== 'SHORT_ANSWER' ? (
                          question.options.map((option, optionIndex) => {
                            const isUserChoice = userAnswer === option.text;
                            const isCorrectOption = option.isCorrect;
                            
                            return (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded text-sm ${
                                  isCorrectOption 
                                    ? 'bg-green-100 border border-green-300' 
                                    : isUserChoice && !isCorrectOption
                                    ? 'bg-red-100 border border-red-300'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <span>{option.text}</span>
                                  {isUserChoice && (
                                    <span className="ml-auto text-xs font-medium text-blue-600">
                                      Your choice
                                    </span>
                                  )}
                                  {isCorrectOption && (
                                    <span className="ml-auto text-xs font-medium text-green-600">
                                      Correct
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="space-y-2">
                            <div className={`p-2 rounded text-sm ${
                              isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                            }`}>
                              <p className="text-gray-800">
                                <span className="font-medium">Your answer:</span> {userAnswer}
                              </p>
                              {!isCorrect && correctAnswer && (
                                <p className="text-gray-800 mt-1">
                                  <span className="font-medium">Correct answer:</span> {correctAnswer}
                                </p>
                              )}
                              {isCorrect && (
                                <p className="text-green-600 text-xs mt-1 font-medium">✓ Correct</p>
                              )}
                              {!isCorrect && (
                                <p className="text-red-600 text-xs mt-1 font-medium">✗ Incorrect</p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              Question type: {question.questionType} | Options not loaded
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {question.explanation && (
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button variant="outline" onClick={() => router.push('/subjects')}>Back to Quizzes</Button>
          <Link href={`/start-quiz/${currentQuiz.id}`}>
            <Button>Retake Quiz</Button>
          </Link>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
