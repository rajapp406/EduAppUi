import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { BookOpen, Brain, Award, TrendingUp, Play, Clock } from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';


const Dashboard: React.FC = () => {
  const { totalCredits, usedCredits } = useSelector((state: RootState) => state.credits);
  const { completedQuizzes } = useSelector((state: RootState) => state.quiz);
  const { lessons } = useSelector((state: RootState) => state.lessons);
  const router = useRouter();
  const remainingCredits = totalCredits - usedCredits;
  const completedLessons = lessons.filter(l => l.completed).length;
  const averageScore = completedQuizzes.length > 0 
    ? Math.round(completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / completedQuizzes.length)
    : 0;
console.log('dashboard...0000');
  const recentLessons = lessons.slice(0, 3);
  const recentQuizzes = [
    { id: '1', title: 'Basic Mathematics', difficulty: 'easy', creditCost: 5 },
    { id: '2', title: 'Physics Fundamentals', difficulty: 'medium', creditCost: 8 },
    { id: '3', title: 'Chemistry Basics', difficulty: 'easy', creditCost: 5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
        <p className="text-gray-600 mt-1">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Available Credits"
          value={remainingCredits}
          icon={BookOpen}
          color="blue"
          trend={{ value: 5, label: 'from last week' }}
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
                    {lesson.creditCost} credits
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
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Brain className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {quiz.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={quiz.difficulty === 'easy' ? 'success' : quiz.difficulty === 'medium' ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {quiz.creditCost} credits
                  </div>
                </div>
              ))}
            </div>
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
              <span>Take Quiz</span>
            </Button>
            <Button
              variant="secondary"
              className="flex items-center justify-center space-x-2"
              onClick={() =>    router.push('/subjects')}
            >
              <Play className="h-4 w-4" />
              <span>Subjects</span>
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
              onClick={() => router.push('/progress')}
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