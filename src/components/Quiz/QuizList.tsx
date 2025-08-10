import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { 
  loadQuizzesAsync,
  loadQuizzesByChapter,
  loadQuizzesBySubject,
} from '../../store/slices/quiz/thunks';
import { BookOpen, Clock, Bookmark } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';
import { QuizLoader, QuizListSkeleton } from '../ui/QuizLoader';
import { useRouter, useSearchParams } from 'next/navigation';
import { Quiz } from '@/models/api';
import { startQuiz } from '@/store/slices/quiz/quizSlice';

interface QuizListProps {
  onStartQuiz?: () => void;
  subjectId?: string;
  chapterId?: string;
  title?: string;
  description?: string;
}

const QuizList: React.FC<QuizListProps> = ({ 
  onStartQuiz = () => {}, 
  subjectId, 
  chapterId,
  title = 'Available Quizzes',
  description = 'Test your knowledge and earn certificates'
}) => {
  const dispatch: any = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get quizzes based on props or URL params
  const effectiveSubjectId = subjectId || searchParams?.get('subjectId') || '';
  const effectiveChapterId = chapterId || searchParams?.get('chapterId') || '';
  
  const { 
    availableQuizzes, 
    quizzesBySubject, 
    quizzesByChapter, 
    isLoadingQuizzes,
    pagination
  } = useSelector((state: RootState) => state.quiz);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Determine which quizzes to display
  let displayQuizzes: Quiz[] = [];

  if (effectiveChapterId && quizzesByChapter[effectiveChapterId]) {
    displayQuizzes = quizzesByChapter[effectiveChapterId];
  } else if (effectiveSubjectId) {
    displayQuizzes = quizzesBySubject[effectiveSubjectId] || [];
  } else {
    displayQuizzes = availableQuizzes;
  }

  // Load appropriate quizzes based on context
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        if (effectiveChapterId) {
          await dispatch(loadQuizzesByChapter({ 
            chapterId: effectiveChapterId, 
            page: currentPage, 
            limit: itemsPerPage 
          }));
        } else if (effectiveSubjectId) {
          await dispatch(loadQuizzesBySubject({ 
            subjectId: effectiveSubjectId, 
            page: currentPage, 
            limit: itemsPerPage 
          }));
        } else {
          await dispatch(loadQuizzesAsync({ 
            page: currentPage, 
            limit: itemsPerPage 
          }));
        }
      } catch (error) {
        console.error('Error loading quizzes:', error);
      }
    };
    
    loadQuizzes();
  }, [effectiveSubjectId, effectiveChapterId, dispatch, currentPage, itemsPerPage]);

  const handleStartQuiz = (quizId: string) => {
    dispatch(startQuiz(quizId));
    onStartQuiz();
    router.push(`/start-quiz/${quizId}`);
  };

  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return 'secondary';
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  if (isLoadingQuizzes && displayQuizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-lg text-gray-600">{description}</p>
        </div>
        <QuizListSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {pagination && (
            <div className="text-sm text-gray-600">
              Showing {displayQuizzes.length} of {pagination.total} quizzes
            </div>
          )}
        </div>
        <p className="mt-2 text-lg text-gray-600">{description}</p>
        
        {pagination && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pagination || currentPage <= 1 || isLoadingQuizzes}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination || currentPage >= pagination.totalPages || isLoadingQuizzes}
                variant="outline"
              >
                Next
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {pagination?.totalPages || 1}
            </div>
          </div>
        )}
        
        {displayQuizzes.length === 0 && !isLoadingQuizzes ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No quizzes found</h3>
            <p className="mt-1 text-gray-500">There are no quizzes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayQuizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 p-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                    <Badge variant={getDifficultyColor(quiz.averageDifficulty)}>
                      {quiz.averageDifficulty || 'Medium'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {quiz.description || 'Test your knowledge with this quiz'}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {quiz.primarySubject && (
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                        <span>{quiz.primarySubject.name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{quiz.timeLimit ? `${quiz.timeLimit} min` : 'No time limit'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Bookmark className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{quiz.questionCount || (quiz.questions ? quiz.questions.length : 0)} questions</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Start Quiz
                </Button>
              </Card>
            </motion.div>
            ))}
            
            {/* Show loading skeletons when loading more items */}
            {isLoadingQuizzes && displayQuizzes.length > 0 && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded"></div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>
                    
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        {displayQuizzes.length === 0 && !isLoadingQuizzes && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No quizzes available yet.</p>
            {effectiveChapterId && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.back()}
              >
                Back to Chapters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;