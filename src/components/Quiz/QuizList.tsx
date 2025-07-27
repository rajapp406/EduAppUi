import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { startQuiz } from '../../store/slices/quizSlice';
import { spendCredits } from '../../store/slices/creditSlice';
import { Brain, Clock, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface QuizListProps {
  onStartQuiz: () => void;
}

const QuizList: React.FC<QuizListProps> = ({ onStartQuiz }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availableQuizzes } = useSelector((state: RootState) => state.quiz);
  const { totalCredits, usedCredits } = useSelector((state: RootState) => state.credits);

  const remainingCredits = totalCredits - usedCredits;

  const handleStartQuiz = (quizId: string, creditCost: number) => {
    if (remainingCredits >= creditCost) {
      dispatch(startQuiz(quizId));
      dispatch(spendCredits({ amount: creditCost, description: 'Quiz attempt' }));
      onStartQuiz();
      navigate(`/start-quiz/${quizId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Available Quizzes</h2>
        <p className="text-gray-600 mt-1">Test your knowledge and earn certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {quiz.description}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{quiz.subject}</Badge>
                <Badge variant={getDifficultyColor(quiz.difficulty) as any}>
                  {quiz.difficulty}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.round(quiz.timeLimit / 60)} minutes
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  {quiz.questions.length} questions
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-600">
                    {quiz.creditCost} credits
                  </span>
                  <Button
                    variant="primary"
                    disabled={remainingCredits < quiz.creditCost}
                    onClick={() => handleStartQuiz(quiz.id, quiz.creditCost)}
                  >
                    {remainingCredits < quiz.creditCost ? 'Insufficient Credits' : 'Start Quiz'}
                  </Button>
                </div>
                {remainingCredits < quiz.creditCost && (
                  <p className="text-red-600 text-sm mt-2">
                    You need {quiz.creditCost - remainingCredits} more credits
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;