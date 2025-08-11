'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MainLayout } from '@/components/Layout/MainLayout';
import { 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Target, 
  Clock, 
  Users, 
  Award, 
  TrendingUp,
  CheckCircle,
  Star,
  Download,
  Calendar
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';

// Category data (in a real app, this would come from an API)
const categoryData = {
  math: {
    name: 'Mathematics Olympiad',
    description: 'Master advanced mathematical concepts and problem-solving techniques',
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    topics: [
      { id: 1, name: 'Algebra', progress: 75, difficulty: 'Medium', lessons: 12, tests: 5 },
      { id: 2, name: 'Geometry', progress: 60, difficulty: 'Hard', lessons: 15, tests: 7 },
      { id: 3, name: 'Number Theory', progress: 45, difficulty: 'Hard', lessons: 10, tests: 4 },
      { id: 4, name: 'Combinatorics', progress: 30, difficulty: 'Expert', lessons: 8, tests: 3 }
    ],
    practiceTests: [
      { id: 1, name: 'Basic Algebra Challenge', difficulty: 'Easy', duration: 60, questions: 20, attempts: 3 },
      { id: 2, name: 'Geometry Mastery Test', difficulty: 'Medium', duration: 90, questions: 25, attempts: 1 },
      { id: 3, name: 'Advanced Number Theory', difficulty: 'Hard', duration: 120, questions: 15, attempts: 0 },
      { id: 4, name: 'Combinatorics Expert Level', difficulty: 'Expert', duration: 150, questions: 12, attempts: 0 }
    ],
    upcomingEvents: [
      { name: 'Regional Math Olympiad', date: '2024-03-15', daysLeft: 25 },
      { name: 'National Championship', date: '2024-05-20', daysLeft: 91 }
    ]
  },
  science: {
    name: 'Science Olympiad',
    description: 'Explore physics, chemistry, and biology through competitive challenges',
    color: 'green',
    gradient: 'from-green-500 to-green-600',
    topics: [
      { id: 1, name: 'Physics', progress: 65, difficulty: 'Medium', lessons: 18, tests: 6 },
      { id: 2, name: 'Chemistry', progress: 55, difficulty: 'Medium', lessons: 16, tests: 5 },
      { id: 3, name: 'Biology', progress: 70, difficulty: 'Easy', lessons: 14, tests: 7 },
      { id: 4, name: 'Earth Science', progress: 40, difficulty: 'Medium', lessons: 12, tests: 4 }
    ],
    practiceTests: [
      { id: 1, name: 'Physics Fundamentals', difficulty: 'Easy', duration: 75, questions: 30, attempts: 2 },
      { id: 2, name: 'Chemistry Lab Challenge', difficulty: 'Medium', duration: 90, questions: 25, attempts: 1 },
      { id: 3, name: 'Biology Systems Test', difficulty: 'Medium', duration: 80, questions: 35, attempts: 3 },
      { id: 4, name: 'Integrated Science Challenge', difficulty: 'Hard', duration: 120, questions: 40, attempts: 0 }
    ],
    upcomingEvents: [
      { name: 'State Science Fair', date: '2024-04-10', daysLeft: 51 },
      { name: 'International Science Olympiad', date: '2024-06-15', daysLeft: 117 }
    ]
  },
  computer: {
    name: 'Computer Science Olympiad',
    description: 'Code your way to victory with algorithms and programming challenges',
    color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    topics: [
      { id: 1, name: 'Algorithms', progress: 80, difficulty: 'Hard', lessons: 20, tests: 8 },
      { id: 2, name: 'Data Structures', progress: 70, difficulty: 'Medium', lessons: 15, tests: 6 },
      { id: 3, name: 'Programming', progress: 85, difficulty: 'Medium', lessons: 25, tests: 10 },
      { id: 4, name: 'Logic & Problem Solving', progress: 60, difficulty: 'Hard', lessons: 12, tests: 5 }
    ],
    practiceTests: [
      { id: 1, name: 'Algorithm Design Challenge', difficulty: 'Medium', duration: 180, questions: 10, attempts: 4 },
      { id: 2, name: 'Data Structure Mastery', difficulty: 'Hard', duration: 150, questions: 8, attempts: 2 },
      { id: 3, name: 'Coding Competition Prep', difficulty: 'Expert', duration: 240, questions: 6, attempts: 1 },
      { id: 4, name: 'Logic Puzzle Championship', difficulty: 'Hard', duration: 120, questions: 12, attempts: 0 }
    ],
    upcomingEvents: [
      { name: 'Regional Coding Contest', date: '2024-03-30', daysLeft: 40 },
      { name: 'International Programming Olympiad', date: '2024-07-15', daysLeft: 147 }
    ]
  },
  english: {
    name: 'English Olympiad',
    description: 'Enhance language skills through literature and linguistic challenges',
    color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    topics: [
      { id: 1, name: 'Grammar', progress: 90, difficulty: 'Easy', lessons: 10, tests: 5 },
      { id: 2, name: 'Literature', progress: 65, difficulty: 'Medium', lessons: 18, tests: 7 },
      { id: 3, name: 'Vocabulary', progress: 75, difficulty: 'Easy', lessons: 12, tests: 6 },
      { id: 4, name: 'Comprehension', progress: 80, difficulty: 'Medium', lessons: 15, tests: 8 }
    ],
    practiceTests: [
      { id: 1, name: 'Grammar Mastery Test', difficulty: 'Easy', duration: 45, questions: 40, attempts: 5 },
      { id: 2, name: 'Literature Analysis Challenge', difficulty: 'Medium', duration: 90, questions: 20, attempts: 2 },
      { id: 3, name: 'Vocabulary Championship', difficulty: 'Medium', duration: 60, questions: 50, attempts: 3 },
      { id: 4, name: 'Advanced Comprehension', difficulty: 'Hard', duration: 75, questions: 15, attempts: 1 }
    ],
    upcomingEvents: [
      { name: 'State English Competition', date: '2024-04-05', daysLeft: 46 },
      { name: 'National Language Olympiad', date: '2024-05-25', daysLeft: 96 }
    ]
  }
};

export default function OlympiadCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const category = params.category as string;
  
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const categoryInfo = categoryData[category as keyof typeof categoryData];

  if (!categoryInfo) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Button onClick={() => router.push('/olympiad')}>
            Back to Olympiad
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      case 'expert': return 'primary';
      default: return 'secondary';
    }
  };

  const handleStartPractice = (testId: number) => {
    router.push(`/olympiad/${category}/practice/${testId}`);
  };

  const handleTopicClick = (topicId: number) => {
    router.push(`/olympiad/${category}/topic/${topicId}`);
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
              onClick={() => router.push('/olympiad')}
              className="mr-4 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Olympiad</span>
            </Button>
          </div>

          {/* Category Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryInfo.name}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {categoryInfo.description}
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Start Learning</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Take Practice Test</span>
              </Button>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Materials</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Topics Section */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Topics</h2>
                <div className="space-y-4">
                  {categoryInfo.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => handleTopicClick(topic.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                        <Badge variant={getDifficultyColor(topic.difficulty)} size="sm">
                          {topic.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{topic.progress}%</span>
                        </div>
                        <ProgressBar progress={topic.progress} color="blue" size="sm" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{topic.lessons} lessons</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{topic.tests} tests</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Continue →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Practice Tests Section */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Tests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryInfo.practiceTests.map((test) => (
                    <div key={test.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                        <Badge variant={getDifficultyColor(test.difficulty)} size="sm">
                          {test.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>{test.questions} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{test.attempts} attempts</span>
                        </div>
                      </div>
                      
                      <Button
                        variant={test.attempts > 0 ? "outline" : "primary"}
                        size="sm"
                        className="w-full"
                        onClick={() => handleStartPractice(test.id)}
                      >
                        {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {categoryInfo.upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">{event.name}</h4>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Date: {event.date}</div>
                        <div className="text-orange-600 font-medium">
                          {event.daysLeft} days left
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Progress Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {Math.round(categoryInfo.topics.reduce((sum, topic) => sum + topic.progress, 0) / categoryInfo.topics.length)}%
                    </div>
                    <div className="text-sm text-gray-600">Overall Progress</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Topics</span>
                      <span>{categoryInfo.topics.filter(t => t.progress >= 80).length}/{categoryInfo.topics.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Practice Tests Taken</span>
                      <span>{categoryInfo.practiceTests.reduce((sum, test) => sum + test.attempts, 0)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Study Materials
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Discussion Forum
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Achievements
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}