

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function QuizResultsPage() {
  const router = useRouter();
  const { completedQuizzes, currentQuiz, userAnswers } = useSelector((state: RootState) => state.quiz);
  
  // Get the most recent quiz result
  console.log(completedQuizzes, currentQuiz, userAnswers)
  const latestResult = completedQuizzes[completedQuizzes.length - 1];
  // Redirect if there are no completed quizzes
  useEffect(() => {
    if (!latestResult) {
      router.push('/quiz');
    }
  }, [latestResult, router]);

  if (!latestResult || !currentQuiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No quiz results found</h2>
          <Link href="/quiz">
            <Button>Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { score } = latestResult;
  const totalQuestions = currentQuiz.questions.length;
  const correctAnswers = Math.round((score / 100) * totalQuestions);

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
            {currentQuiz.questions.map((question, index) => {
              const isCorrect = userAnswers[index] === question.options.find((option) => option.isCorrect)?.text;
              const userAnswer = userAnswers[index] ?? 'No answer provided';
              
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
                      <div className="mt-1 text-sm text-gray-600">
                        <p><span className="font-medium">Your answer:</span> {userAnswer}</p>
                        {!isCorrect && (
                          <p><span className="font-medium">Correct answer:</span> {question.  options.find((option) => option.isCorrect)?.text}</p>
                        )}
                        {question.explanation && (
                          <p className="mt-1 italic">Explanation: {question.explanation}</p>
                        )}
                      </div>
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
