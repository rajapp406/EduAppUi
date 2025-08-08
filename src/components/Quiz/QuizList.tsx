import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { 
  loadQuizzesAsync, 
  loadQuizzesBySubject, 
  loadQuizzesByChapter, 
  startQuiz 
} from '../../store/slices/quizSlice';
import { BookOpen, Clock, Bookmark, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Quiz } from '@/models/api';

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
  const dispatch: any = useDispatch();
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
  
  // Debug logs
  console.log('QuizList state:', {
    effectiveSubjectId,
    effectiveChapterId,
    availableQuizzes,
    quizzesBySubject,
    quizzesByChapter,
    isLoadingQuizzes,
    pagination
  });
  // Determine which quizzes to display
  let displayQuizzes: Quiz[] = [];
  
  console.log('Determining quizzes to display:', {
    effectiveChapterId,
    effectiveSubjectId,
    hasChapterQuizzes: effectiveChapterId ? !!quizzesByChapter[effectiveChapterId] : false,
    hasSubjectQuizzes: effectiveSubjectId ? !!quizzesBySubject[effectiveSubjectId] : false,
    availableQuizzesCount: availableQuizzes.length,
    allQuizzesBySubject: quizzesBySubject,
    allQuizzesByChapter: quizzesByChapter
  });
  
  if (effectiveChapterId && quizzesByChapter[effectiveChapterId]) {
    displayQuizzes = quizzesByChapter[effectiveChapterId];
    console.log('Using chapter quizzes:', displayQuizzes);
  } else if (effectiveSubjectId) {
    displayQuizzes = quizzesBySubject[effectiveSubjectId] || [];
    console.log('Using subject quizzes:', displayQuizzes);
  } else {
    displayQuizzes = availableQuizzes;
    console.log('Using available quizzes:', displayQuizzes);
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
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
        <span className="sr-only">Loading quizzes...</span>
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
          displayQuizzes.map((quiz) => (
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
          ))
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