'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import type { AppDispatch } from '@/store/store';
import { BookOpen } from 'lucide-react';
import QuizTaking from '@/components/Quiz/QuizTaking';
import { fetchQuizById, startQuizAttempt } from '@/store/slices/quiz/thunks';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = params as { id: string };
  console.log('id', id);
  const { currentQuiz, isLoading, error } = useSelector((state: RootState) => state.quiz);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('Quiz Page State:', { 
    id, 
    isLoading, 
    error, 
    hasCurrentQuiz: !!currentQuiz,
    currentQuizId: currentQuiz?.id,
    questionsCount: currentQuiz?.questions?.length 
  });
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset initialization when ID changes
  useEffect(() => {
    setIsInitialized(false);
  }, [id]);

  useEffect(() => {
    // Fetch quiz data when component mounts and we have an ID
    if (id && isClient && !isInitialized) {
      console.log('Fetching quiz data for ID:', id);
      setIsInitialized(true);
      
      const fetchData = async () => {
        try {
          const fetchResult = await dispatch(fetchQuizById(id) as any);
          console.log('Fetch quiz result:', fetchResult);
          
          if (fetchResult.type.endsWith('/fulfilled')) {
            const attemptResult = await dispatch(startQuizAttempt(id) as any);
            console.log('Start quiz attempt result:', attemptResult);
          }
        } catch (error) {
          console.error('Error fetching quiz data:', error);
        }
      };
      
      fetchData();
    }
  }, [dispatch, id, isClient, isInitialized]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push(`/login?callbackUrl=/start-quiz/${id}`);
    }
  }, [isClient, isAuthenticated, id, router]);

  // Show loading state during initial render
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
            </div>
            <div className="relative">
              <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
            </div>
          </div>
          <div className="mb-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Quiz</h3>
          <p className="text-gray-600">Preparing your questions...</p>
        </div>
      </div>
    );
  }

  // Show error state if quiz couldn't be loaded
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push('/quiz')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Quiz List
        </button>
      </div>
    );
  }

  // Show the quiz taking interface
  return (
    <MainLayout>  
      {
        currentQuiz ? (
          <QuizTaking 
          currentQuiz={currentQuiz}
          onQuizComplete={(quizAttemptId: string) => {
          // Handle quiz completion
          router.push(`/quiz/results/${quizAttemptId}`);
        }}
      />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-ping">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
              </div>
              <div className="relative">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
              </div>
            </div>
            <div className="mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Quiz</h3>
            <p className="text-gray-600">Preparing your questions...</p>
          </div>
        </div>
      )
      }
      </MainLayout>
  );
}
