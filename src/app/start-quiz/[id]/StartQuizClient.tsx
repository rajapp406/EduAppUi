'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/store';
import { Quiz } from '@/models/api';
import QuizTaking from '@/components/Quiz/QuizTaking';
import { startQuizAttempt } from '@/store/slices/quiz/thunks';
import { setCurrentQuiz } from '@/store/slices/quiz/quizSlice';
import Button from '@/components/ui/Button';
import { Clock, BookOpen, Users, BarChart3 } from 'lucide-react';

// Utility function to get user ID with fallback
const getUserId = (user: any): string => {
  // Try different possible user ID properties
  const possibleIds = [
    user?.id,
    user?.userId,
    user?.user_id,
    user?.sub, // Common in JWT tokens
  ];
  
  const userId = possibleIds.find(id => id && typeof id === 'string' && id.trim() !== '');
  console.log('getUserId:', { 
    user, 
    possibleIds, 
    selectedId: userId,
    fallbackId: '0016e789-b406-46a5-bf04-0cca30fea38e'
  });
  
  // Return the found ID or fallback
  return userId || '0016e789-b406-46a5-bf04-0cca30fea38e';
};

interface StartQuizClientProps {
  quiz: Quiz;
}

export function StartQuizClient({ quiz }: StartQuizClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentQuizAttempt, isLoading } = useSelector((state: RootState) => state.quiz);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Debug: Log the complete auth state
  useEffect(() => {
    console.log('Complete Auth State:', {
      isAuthenticated,
      user,
      userKeys: user ? Object.keys(user) : [],
      userId: user?.id,
      userType: typeof user?.id
    });
  }, [isAuthenticated, user]);

  // Set the current quiz in Redux store
  useEffect(() => {
    dispatch(setCurrentQuiz(quiz));
  }, [dispatch, quiz]);

  // Check authentication
  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, user, userId: user?.id });
    if (!isAuthenticated) {
     // router.push('/login');
    }
  }, [isAuthenticated, router, user]);

  const handleStartQuiz = async () => {
    console.log('Starting quiz with user:', { isAuthenticated, user, userId: user?.id });

    // Get user ID with fallback
    const userId = getUserId(user);
    
    console.log('Final userId for quiz:', userId);
    
    if (!userId) {
      console.error('No user ID available');
      //router.push('/login');
      return;
    }

    setIsStarting(true);
    try {
      const result = await dispatch(startQuizAttempt(quiz.id));
      console.log(result, 'resulttttt')
      if (result.type.endsWith('/fulfilled')) {
        setQuizStarted(true);
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleQuizComplete = () => {
    if (currentQuizAttempt?.id) {
      router.push(`/quiz/results/${currentQuizAttempt.id}`);
    } else {
      router.push('/quiz');
    }
  };

  // Show quiz interface if started
  if (quizStarted && currentQuizAttempt) {
    return (
      <QuizTaking 
        currentQuiz={quiz}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  // Show quiz preview/start screen
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              {quiz.primarySubject && (
                <p className="text-blue-100">
                  {quiz.primarySubject.name} • Grade {quiz.primarySubject.grade}
                </p>
              )}
            </div>
          </div>
          {quiz.description && (
            <p className="text-blue-100 text-lg">{quiz.description}</p>
          )}
        </div>

        {/* Quiz Info */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{quiz.questions?.length || 0}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {quiz.timeLimit ? `${quiz.timeLimit}m` : 'No limit'}
              </div>
              <div className="text-sm text-gray-600">Time Limit</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {quiz.averageDifficulty || 'Mixed'}
              </div>
              <div className="text-sm text-gray-600">Difficulty</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {quiz.attemptCount || 0}
              </div>
              <div className="text-sm text-gray-600">Attempts</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Read each question carefully before selecting your answer</li>
                <li>• You can navigate between questions using the Previous/Next buttons</li>
                <li>• Make sure to answer all questions before submitting</li>
                {quiz.timeLimit && (
                  <li>• You have {quiz.timeLimit} minutes to complete this quiz</li>
                )}
                <li>• Your progress will be saved automatically</li>
                <li>• Click "Submit Quiz" when you're ready to finish</li>
              </ul>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            {!isAuthenticated ? (
              <div className="text-center">
                <p className="text-red-600 mb-4">Please log in to start the quiz</p>
                <Button
                  onClick={() => router.push('/login')}
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleStartQuiz}
                  disabled={isStarting || isLoading}
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  {isStarting ? 'Starting Quiz...' : 'Start Quiz'}
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Make sure you have a stable internet connection
                </p>
                {/* Debug info - remove in production */}
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left">
                  <strong>Debug Info:</strong><br/>
                  User ID: {getUserId(user)}<br/>
                  Authenticated: {isAuthenticated ? 'Yes' : 'No'}<br/>
                  User Object: {user ? 'Present' : 'Missing'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}