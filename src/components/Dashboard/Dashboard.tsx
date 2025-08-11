import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { BookOpen, Brain, Award, TrendingUp, Play, Clock, Loader2 } from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { QuizStatistics } from './QuizStatistics';
import { loadQuizzesAsync } from '../../store/slices/quiz/thunks';
import { Quiz } from '../../models/api';


const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { completedQuizzes, availableQuizzes, isLoadingQuizzes } = useSelector((state: RootState) => state.quiz);
  const { lessons } = useSelector((state: RootState) => state.lessons);
  const router = useRouter();
  const [featuredQuizzes, setFeaturedQuizzes] = useState<Quiz[]>([]);
  
  const completedLessons = lessons.filter(l => l.completed).length;
  const averageScore = completedQuizzes.length > 0 
    ? Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes.length)
    : 0;

  // Fetch quizzes on component mount
  useEffect(() => {
    dispatch(loadQuizzesAsync({ page: 1, limit: 6 }));
  }, [dispatch]);

  // Set featured quizzes when available quizzes are loaded
  useEffect(() => {
    if (availableQuizzes && availableQuizzes.length > 0) {
      // Get first 3 quizzes for the dashboard widget
      setFeaturedQuizzes(availableQuizzes.slice(0, 3));
    }
  }, [availableQuizzes]);

  const recentLessons = lessons.slice(0, 3);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  const handleQuizClick = (quizId: string) => {
    router.push(`/start-quiz/${quizId}`);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
        <p className="text-gray-600 mt-1">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Available Quizzes"
          value={availableQuizzes?.length || 0}
          icon={BookOpen}
          color="blue"
          trend={{ value: 3, label: 'new this week' }}
        />
        <StatsCard
          title="Quizzes Completed"
          value={completedQuizzes.length}
          icon={Brain}
          color="green"
        />
        <StatsCard
          title="Lessons Watched"
          value={completedLessons}
          icon={Play}
          color="purple"
        />
        <StatsCard
          title="Average Score"
          value={averageScore > 0 ? `${averageScore}%` : 'N/A'}
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Quiz Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <QuizStatistics />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/lessons')}
              >
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Play className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {lesson.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" size="sm">
                        {lesson.subject}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.round(lesson.duration / 60)}min
                      </div>
                    </div>
                    <div className="mt-2">
                      <ProgressBar progress={lesson.progress} size="sm" />
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Free
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Available Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Test Your Knowledge</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/quiz')}
              >
                View All
              </Button>
            </div>
            
            {isLoadingQuizzes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading quizzes...</span>
              </div>
            ) : featuredQuizzes.length > 0 ? (
              <div className="space-y-4">
                {featuredQuizzes.map((quiz) => (
                  <div 
                    key={quiz.id} 
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => handleQuizClick(quiz.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Brain className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-green-700 transition-colors">
                        {quiz.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={getDifficultyColor(quiz.averageDifficulty)}
                          size="sm"
                        >
                          {quiz.averageDifficulty || 'Mixed'}
                        </Badge>
                        {quiz.questionCount && (
                          <span className="text-xs text-gray-500">
                            {quiz.questionCount} questions
                          </span>
                        )}
                        {quiz.timeLimit && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {quiz.timeLimit}min
                          </div>
                        )}
                      </div>
                      {quiz.primarySubject && (
                        <div className="mt-1">
                          <span className="text-xs text-blue-600 font-medium">
                            {quiz.primarySubject.name} • Grade {quiz.primarySubject.grade}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuizClick(quiz.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No quizzes available at the moment</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/quiz')}
                >
                  Browse All Quizzes
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="primary"
              className="flex items-center justify-center space-x-2"
              onClick={() => router.push('/quiz')}
            >
              <Brain className="h-4 w-4" />
              <span>Browse Quizzes</span>
            </Button>
            <Button
              variant="secondary"
              className="flex items-center justify-center space-x-2"
              onClick={() => router.push('/subjects')}
            >
              <BookOpen className="h-4 w-4" />
              <span>Study Subjects</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2"
              onClick={() => router.push('/olympiad')}
            >
              <Award className="h-4 w-4" />
              <span>Olympiad Prep</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center space-x-2"
              onClick={() => router.push('/dashboard')}
            >
              <TrendingUp className="h-4 w-4" />
              <span>View Progress</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;