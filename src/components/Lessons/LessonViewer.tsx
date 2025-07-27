import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { completeLesson, updateProgress } from '../../store/slices/lessonSlice';
import { earnCredits } from '../../store/slices/creditSlice';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';

interface LessonViewerProps {
  onBack: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ onBack }) => {
  const dispatch = useDispatch();
  const { currentLesson } = useSelector((state: RootState) => state.lessons);

  useEffect(() => {
    if (currentLesson && !currentLesson.completed) {
      // Simulate progress tracking
      const interval = setInterval(() => {
        const newProgress = Math.min(currentLesson.progress + 1, 100);
        dispatch(updateProgress({ lessonId: currentLesson.id, progress: newProgress }));
        
        if (newProgress === 100) {
          dispatch(completeLesson(currentLesson.id));
          dispatch(earnCredits({ amount: 2, description: 'Lesson completion bonus' }));
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentLesson, dispatch]);

  if (!currentLesson) return null;

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
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center space-x-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Lessons</span>
        </Button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentLesson.title}
            </h1>
            <p className="text-gray-600">{currentLesson.description}</p>
          </div>
          {currentLesson.completed && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Completed</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <Badge variant="secondary">{currentLesson.subject}</Badge>
          <Badge variant={getDifficultyColor(currentLesson.difficulty) as any}>
            {currentLesson.difficulty}
          </Badge>
          <span className="text-sm text-gray-500">
            {Math.round(currentLesson.duration / 60)} minutes
          </span>
        </div>

        {!currentLesson.completed && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(currentLesson.progress)}%</span>
            </div>
            <ProgressBar progress={currentLesson.progress} color="blue" />
          </div>
        )}
      </div>

      {/* Video Player */}
      <Card className="overflow-hidden mb-6">
        <div className="aspect-video">
          <iframe
            src={currentLesson.videoUrl}
            className="w-full h-full"
            title={currentLesson.title}
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </Card>

      {/* Completion Message */}
      {currentLesson.completed && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">
                Congratulations! Lesson Completed
              </h3>
              <p className="text-green-700 mt-1">
                You've earned 2 bonus credits for completing this lesson. Keep up the great work!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LessonViewer;