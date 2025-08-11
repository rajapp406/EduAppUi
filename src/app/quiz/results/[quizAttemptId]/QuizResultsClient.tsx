'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SimpleButton from '@/components/ui/SimpleButton';
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Quiz } from '@/models/api';
import { QuizAttempt } from '@/models/quiz';

interface QuizResultsClientProps {
  quizAttempt: QuizAttempt;
  quiz: Quiz;
}

export function QuizResultsClient({ quizAttempt, quiz }: QuizResultsClientProps) {
  const router = useRouter();
  const [showExplanations, setShowExplanations] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  
  const { score, totalQuestions, correctAnswers } = quizAttempt;
  const userAnswers = quizAttempt.answers || [];

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <p className="text-gray-600">
            Completed on {new Date(quizAttempt.completedAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Score Summary */}
        <div className={`rounded-lg p-6 mb-8 text-center border ${getScoreBgColor(score)}`}>
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">{quiz.title}</h2>
          <div className={`text-5xl font-bold my-4 ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(quizAttempt.timeSpent / 60)}m
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <SimpleButton
            variant="outline"
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex items-center gap-2"
          >
            {showExplanations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </SimpleButton>
        </div>

        {/* Questions Review */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Review Your Answers</h2>
          <div className="space-y-6">
            {quiz.questions?.map((question, index) => {
              // Handle nested question structure
              const actualQuestion = (question as any).question || question;
              
              // Find the user's answer for this question
              const userAnswerObj = userAnswers.find(answer => answer.questionId === actualQuestion.id);
              const userAnswer = userAnswerObj?.selectedOption ?? 'No answer provided';
              
              // Find the correct answer
              const correctOption = actualQuestion.options?.find((option: any) => option.isCorrect);
              const correctAnswer = correctOption?.text;
              
              // Check if the user's answer is correct
              const isCorrect = userAnswer === correctAnswer;
              const isExpanded = expandedQuestions.has(actualQuestion.id);
              
              return (
                <div 
                  key={actualQuestion.id} 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900">
                          Question {index + 1}: {actualQuestion.questionText}
                        </h3>
                        <SimpleButton
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuestionExpansion(actualQuestion.id)}
                          className="ml-2"
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </SimpleButton>
                      </div>
                      
                      {/* Quick answer summary */}
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                        {!isCorrect && (
                          <span className="ml-2 text-gray-600">
                            Your answer: {userAnswer}
                          </span>
                        )}
                      </div>

                      {/* Expanded view */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {/* Display all options with indicators */}
                          {actualQuestion.options && actualQuestion.options.length > 0 ? (
                            <div className="space-y-2">
                              {actualQuestion.options.map((option: any, optionIndex: number) => {
                                const isUserChoice = userAnswer === option.text;
                                const isCorrectOption = option.isCorrect;
                                
                                return (
                                  <div 
                                    key={optionIndex}
                                    className={`p-3 rounded text-sm border ${
                                      isCorrectOption 
                                        ? 'bg-green-100 border-green-300' 
                                        : isUserChoice && !isCorrectOption
                                        ? 'bg-red-100 border-red-300'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="font-medium mr-3 text-gray-700">
                                          {String.fromCharCode(65 + optionIndex)}.
                                        </span>
                                        <span className="text-gray-900">{option.text}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isUserChoice && (
                                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            Your choice
                                          </span>
                                        )}
                                        {isCorrectOption && (
                                          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                                            Correct
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className={`p-3 rounded text-sm border ${
                              isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                            }`}>
                              <p><span className="font-medium">Your answer:</span> {userAnswer}</p>
                              {!isCorrect && correctAnswer && (
                                <p className="mt-1"><span className="font-medium">Correct answer:</span> {correctAnswer}</p>
                              )}
                            </div>
                          )}
                          
                          {/* Explanation */}
                          {showExplanations && actualQuestion.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-sm text-blue-800">
                                <span className="font-medium">Explanation:</span> {actualQuestion.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Accuracy:</span> {Math.round((correctAnswers / totalQuestions) * 100)}%
            </div>
            <div>
              <span className="font-medium">Average time per question:</span> {Math.round(quizAttempt.timeSpent / totalQuestions)}s
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <SimpleButton variant="outline" onClick={() => router.push('/quiz')}>
            Back to Quizzes
          </SimpleButton>
          <Link href={`/start-quiz/${quiz.id}`}>
            <SimpleButton>Retake Quiz</SimpleButton>
          </Link>
          <SimpleButton 
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            View Dashboard
          </SimpleButton>
        </div>
      </div>
    </div>
  );
}

export default QuizResultsClient;