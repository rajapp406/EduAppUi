'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  ArrowLeft, 
  Clock, 
  Flag, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

// Mock test data
const testData = {
  1: {
    name: 'Basic Algebra Challenge',
    duration: 60,
    questions: [
      {
        id: 1,
        question: 'Solve for x: 2x + 5 = 13',
        options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
        correctAnswer: 0,
        explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
      },
      {
        id: 2,
        question: 'What is the slope of the line passing through points (2, 3) and (4, 7)?',
        options: ['2', '3', '4', '1/2'],
        correctAnswer: 0,
        explanation: 'Slope = (y2 - y1) / (x2 - x1) = (7 - 3) / (4 - 2) = 4 / 2 = 2'
      },
      {
        id: 3,
        question: 'Factor the expression: x² - 9',
        options: ['(x - 3)(x + 3)', '(x - 9)(x + 1)', 'x(x - 9)', '(x - 3)²'],
        correctAnswer: 0,
        explanation: 'This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3)'
      }
    ]
  },
  2: {
    name: 'Geometry Mastery Test',
    duration: 90,
    questions: [
      {
        id: 1,
        question: 'What is the area of a circle with radius 5 units?',
        options: ['25π', '10π', '5π', '50π'],
        correctAnswer: 0,
        explanation: 'Area of circle = πr² = π(5)² = 25π square units'
      },
      {
        id: 2,
        question: 'In a right triangle, if one angle is 30°, what is the other acute angle?',
        options: ['60°', '45°', '30°', '90°'],
        correctAnswer: 0,
        explanation: 'In a triangle, angles sum to 180°. With 90° and 30°, the third angle is 180° - 90° - 30° = 60°'
      }
    ]
  }
};

export default function PracticeTestPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const category = params.category as string;
  const testId = parseInt(params.testId as string);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const test = testData[testId as keyof typeof testData];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (test) {
      setTimeLeft(test.duration * 60); // Convert minutes to seconds
      setAnswers(new Array(test.questions.length).fill(-1));
    }
  }, [test]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && !isPaused && !isCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted, isPaused, isCompleted, timeLeft]);

  if (!test) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Not Found</h1>
          <Button onClick={() => router.push(`/olympiad/${category}/practice`)}>
            Back to Practice Tests
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setIsStarted(true);
    setIsPaused(false);
  };

  const handlePauseTest = () => {
    setIsPaused(!isPaused);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    setIsCompleted(true);
    setIsStarted(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    test.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / test.questions.length) * 100);
  };

  const getAnsweredCount = () => {
    return answers.filter(answer => answer !== -1).length;
  };

  if (!isAuthenticated) {
    return null;
  }

  // Pre-test screen
  if (!isStarted && !isCompleted) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => router.push(`/olympiad/${category}/practice`)}
                className="mr-4 flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Practice Tests</span>
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.name}</h1>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{test.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Flag className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{test.questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                </div>

                <div className="text-left mb-8 p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Read each question carefully before selecting your answer</li>
                    <li>• You can navigate between questions using the Previous/Next buttons</li>
                    <li>• Your progress is saved automatically</li>
                    <li>• Submit your test when you're ready or when time runs out</li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartTest}
                  className="flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Test</span>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Results screen
  if (showResults) {
    const score = calculateScore();
    const correctAnswers = test.questions.filter((q, i) => answers[i] === q.correctAnswer).length;

    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    score >= 80 ? 'bg-green-100 text-green-600' :
                    score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Flag className="h-10 w-10" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
                  <p className="text-gray-600">Here are your results</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{score}%</div>
                    <div className="text-sm text-gray-600">Final Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{correctAnswers}/{test.questions.length}</div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{formatTime((test.duration * 60) - timeLeft)}</div>
                    <div className="text-sm text-gray-600">Time Taken</div>
                  </div>
                </div>

                {/* Question Review */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Question Review</h2>
                  <div className="space-y-4">
                    {test.questions.map((question, index) => {
                      const isCorrect = answers[index] === question.correctAnswer;
                      const userAnswer = answers[index];
                      
                      return (
                        <div key={question.id} className={`p-4 rounded-lg border ${
                          isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-2">
                                Question {index + 1}: {question.question}
                              </h3>
                              <div className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Your answer:</span> {
                                  userAnswer !== -1 ? question.options[userAnswer] : 'Not answered'
                                }
                              </div>
                              {!isCorrect && (
                                <div className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">Correct answer:</span> {question.options[question.correctAnswer]}
                                </div>
                              )}
                              <div className="text-sm text-blue-600 italic">
                                {question.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/olympiad/${category}/practice`)}
                  >
                    Back to Practice Tests
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsCompleted(false);
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setAnswers(new Array(test.questions.length).fill(-1));
                      setTimeLeft(test.duration * 60);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Test</span>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Test interface
  const currentQ = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{test.name}</h1>
              <Badge variant="primary">Question {currentQuestion + 1} of {test.questions.length}</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-lg font-mono">
                <Clock className="h-5 w-5 text-red-500" />
                <span className={timeLeft < 300 ? 'text-red-500' : 'text-gray-600'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePauseTest}
                className="flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <ProgressBar progress={progress} showLabel />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Progress: {getAnsweredCount()}/{test.questions.length} answered</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Question */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion] === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-3">
              {currentQuestion === test.questions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleSubmitTest}
                  className="flex items-center space-x-2"
                >
                  <Flag className="h-4 w-4" />
                  <span>Submit Test</span>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}