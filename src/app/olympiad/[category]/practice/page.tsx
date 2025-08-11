'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Target, 
  Award, 
  CheckCircle,
  XCircle,
  RotateCcw,
  TrendingUp
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

// Mock practice tests data
const practiceTestsData = {
  math: [
    {
      id: 1,
      name: 'Basic Algebra Challenge',
      description: 'Test your fundamental algebra skills with equations, inequalities, and functions.',
      difficulty: 'Easy',
      duration: 60,
      questions: 20,
      attempts: 3,
      bestScore: 85,
      averageScore: 78,
      topics: ['Linear Equations', 'Quadratic Functions', 'Polynomials']
    },
    {
      id: 2,
      name: 'Geometry Mastery Test',
      description: 'Explore geometric theorems, proofs, and spatial reasoning problems.',
      difficulty: 'Medium',
      duration: 90,
      questions: 25,
      attempts: 1,
      bestScore: 72,
      averageScore: 72,
      topics: ['Triangles', 'Circles', 'Area & Volume', 'Coordinate Geometry']
    },
    {
      id: 3,
      name: 'Advanced Number Theory',
      description: 'Dive deep into prime numbers, modular arithmetic, and divisibility.',
      difficulty: 'Hard',
      duration: 120,
      questions: 15,
      attempts: 0,
      bestScore: null,
      averageScore: null,
      topics: ['Prime Numbers', 'Modular Arithmetic', 'Diophantine Equations']
    }
  ],
  science: [
    {
      id: 1,
      name: 'Physics Fundamentals',
      description: 'Test your understanding of mechanics, thermodynamics, and waves.',
      difficulty: 'Easy',
      duration: 75,
      questions: 30,
      attempts: 2,
      bestScore: 88,
      averageScore: 82,
      topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Optics']
    },
    {
      id: 2,
      name: 'Chemistry Lab Challenge',
      description: 'Apply chemical principles to laboratory scenarios and reactions.',
      difficulty: 'Medium',
      duration: 90,
      questions: 25,
      attempts: 1,
      bestScore: 76,
      averageScore: 76,
      topics: ['Chemical Reactions', 'Stoichiometry', 'Acids & Bases', 'Organic Chemistry']
    }
  ],
  computer: [
    {
      id: 1,
      name: 'Algorithm Design Challenge',
      description: 'Solve complex algorithmic problems with optimal time and space complexity.',
      difficulty: 'Medium',
      duration: 180,
      questions: 10,
      attempts: 4,
      bestScore: 92,
      averageScore: 85,
      topics: ['Sorting', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms']
    },
    {
      id: 2,
      name: 'Data Structure Mastery',
      description: 'Implement and optimize various data structures for different use cases.',
      difficulty: 'Hard',
      duration: 150,
      questions: 8,
      attempts: 2,
      bestScore: 78,
      averageScore: 74,
      topics: ['Trees', 'Graphs', 'Hash Tables', 'Heaps']
    }
  ],
  english: [
    {
      id: 1,
      name: 'Grammar Mastery Test',
      description: 'Perfect your grammar skills with comprehensive language rules.',
      difficulty: 'Easy',
      duration: 45,
      questions: 40,
      attempts: 5,
      bestScore: 94,
      averageScore: 89,
      topics: ['Syntax', 'Punctuation', 'Parts of Speech', 'Sentence Structure']
    },
    {
      id: 2,
      name: 'Literature Analysis Challenge',
      description: 'Analyze literary works and demonstrate critical thinking skills.',
      difficulty: 'Medium',
      duration: 90,
      questions: 20,
      attempts: 2,
      bestScore: 81,
      averageScore: 78,
      topics: ['Poetry Analysis', 'Prose Interpretation', 'Literary Devices', 'Themes']
    }
  ]
};

export default function OlympiadPracticePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const category = params.category as string;
  
  const [selectedTest, setSelectedTest] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const tests = practiceTestsData[category as keyof typeof practiceTestsData] || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStartTest = (testId: number) => {
    router.push(`/olympiad/${category}/practice/${testId}`);
  };

  const handleViewResults = (testId: number) => {
    router.push(`/olympiad/${category}/practice/${testId}/results`);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/olympiad/${category}`)}
              className="mr-4 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {category.charAt(0).toUpperCase() + category.slice(1)}</span>
            </Button>
          </div>

          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Practice Tests</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sharpen your skills with our comprehensive practice tests designed to simulate real olympiad conditions.
            </p>
          </div>

          {/* Practice Tests Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {tests.map((test) => (
              <Card key={test.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{test.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  </div>
                  <Badge variant={getDifficultyColor(test.difficulty)} size="sm">
                    {test.difficulty}
                  </Badge>
                </div>

                {/* Test Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{test.duration}m</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{test.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <RotateCcw className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{test.attempts}</div>
                    <div className="text-xs text-gray-500">Attempts</div>
                  </div>
                </div>

                {/* Performance Stats */}
                {test.attempts > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(test.bestScore!)}`}>
                            {test.bestScore}%
                          </div>
                          <div className="text-xs text-gray-500">Best</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getScoreColor(test.averageScore!)}`}>
                            {test.averageScore}%
                          </div>
                          <div className="text-xs text-gray-500">Average</div>
                        </div>
                      </div>
                    </div>
                    <ProgressBar 
                      progress={test.bestScore!} 
                      color={test.bestScore! >= 80 ? 'green' : test.bestScore! >= 60 ? 'blue' : 'red'} 
                      size="sm" 
                    />
                  </div>
                )}

                {/* Topics Covered */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Topics Covered:</div>
                  <div className="flex flex-wrap gap-2">
                    {test.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    className="flex-1 flex items-center justify-center space-x-2"
                    onClick={() => handleStartTest(test.id)}
                  >
                    <Play className="w-4 h-4" />
                    <span>{test.attempts > 0 ? 'Retake Test' : 'Start Test'}</span>
                  </Button>
                  
                  {test.attempts > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => handleViewResults(test.id)}
                      className="flex items-center space-x-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>Results</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Overall Statistics */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Practice Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {tests.reduce((sum, test) => sum + test.attempts, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {tests.filter(test => test.bestScore && test.bestScore >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {tests.filter(test => test.bestScore).length > 0 
                    ? Math.round(tests.filter(test => test.bestScore).reduce((sum, test) => sum + test.bestScore!, 0) / tests.filter(test => test.bestScore).length)
                    : 0}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(tests.reduce((sum, test) => sum + (test.duration * test.attempts), 0) / 60)}h
                </div>
                <div className="text-sm text-gray-600">Time Practiced</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}