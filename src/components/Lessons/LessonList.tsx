import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { startLesson } from '../../store/slices/lessonSlice';
import { spendCredits } from '../../store/slices/creditSlice';
import { Play, Clock, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { motion } from 'framer-motion';

interface LessonListProps {
  onStartLesson: () => void;
}

const LessonList: React.FC<LessonListProps> = ({ onStartLesson }) => {
  const dispatch = useDispatch();
  const { lessons } = useSelector((state: RootState) => state.lessons);
  const { totalCredits, usedCredits } = useSelector((state: RootState) => state.credits);

  const remainingCredits = totalCredits - usedCredits;

  const handleStartLesson = (lessonId: string, creditCost: number) => {
    if (remainingCredits >= creditCost) {
      dispatch(startLesson(lessonId));
      dispatch(spendCredits({ amount: creditCost, description: 'Lesson access' }));
      onStartLesson();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Video Lessons</h2>
        <p className="text-gray-600 mt-1">Learn from expert instructors and top educational content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-200">
                <iframe
                  src={lesson.videoUrl}
                  className="w-full h-full object-cover"
                  title={lesson.title}
                  frameBorder="0"
                  allowFullScreen
                />
                {lesson.completed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {lesson.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{lesson.subject}</Badge>
                  <Badge variant={getDifficultyColor(lesson.difficulty) as any}>
                    {lesson.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.round(lesson.duration / 60)} minutes
                  </div>
                  <span className="text-blue-600 font-medium">
                    {lesson.creditCost} credits
                  </span>
                </div>

                {lesson.progress > 0 && (
                  <div className="mb-4">
                    <ProgressBar progress={lesson.progress} showLabel />
                  </div>
                )}

                <div className="mt-auto">
                  <Button
                    variant={lesson.completed ? "secondary" : "primary"}
                    className="w-full flex items-center justify-center space-x-2"
                    disabled={!lesson.completed && remainingCredits < lesson.creditCost}
                    onClick={() => lesson.completed ? onStartLesson() : handleStartLesson(lesson.id, lesson.creditCost)}
                  >
                    <Play className="h-4 w-4" />
                    <span>
                      {lesson.completed ? 'Watch Again' : 
                       remainingCredits < lesson.creditCost ? 'Insufficient Credits' : 
                       'Start Lesson'}
                    </span>
                  </Button>
                  {!lesson.completed && remainingCredits < lesson.creditCost && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                      You need {lesson.creditCost - remainingCredits} more credits
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;