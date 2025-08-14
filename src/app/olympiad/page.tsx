"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { MainLayout } from "@/components/Layout/MainLayout";
import {
  Trophy,
  Target,
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Brain,
  Zap,
  ChevronRight,
  Play,
  Download,
  ExternalLink,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CompetitionsSection } from "@/components/Olympiad/CompetitionsSection";

// Olympiad categories data
const olympiadCategories = [
  {
    id: "math",
    name: "Mathematics Olympiad",
    description:
      "Master advanced mathematical concepts and problem-solving techniques",
    icon: Target,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    lightGradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    subjects: ["Algebra", "Geometry", "Number Theory", "Combinatorics"],
    difficulty: "Advanced",
    duration: "3 hours",
    participants: "50K+",
    nextExam: "2024-03-15",
  },
  {
    id: "science",
    name: "Science Olympiad",
    description:
      "Explore physics, chemistry, and biology through competitive challenges",
    icon: Brain,
    color: "green",
    gradient: "from-green-500 to-green-600",
    lightGradient: "from-green-50 to-green-100",
    borderColor: "border-green-200",
    textColor: "text-green-600",
    subjects: ["Physics", "Chemistry", "Biology", "Earth Science"],
    difficulty: "Intermediate",
    duration: "2.5 hours",
    participants: "35K+",
    nextExam: "2024-04-20",
  },
  {
    id: "computer",
    name: "Computer Science Olympiad",
    description:
      "Code your way to victory with algorithms and programming challenges",
    icon: Zap,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    lightGradient: "from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    subjects: ["Algorithms", "Data Structures", "Programming", "Logic"],
    difficulty: "Expert",
    duration: "4 hours",
    participants: "25K+",
    nextExam: "2024-05-10",
  },
  {
    id: "english",
    name: "English Olympiad",
    description:
      "Enhance language skills through literature and linguistic challenges",
    icon: BookOpen,
    color: "orange",
    gradient: "from-orange-500 to-orange-600",
    lightGradient: "from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    subjects: ["Grammar", "Literature", "Vocabulary", "Comprehension"],
    difficulty: "Intermediate",
    duration: "2 hours",
    participants: "40K+",
    nextExam: "2024-03-25",
  },
];

// Mock user progress data
const userProgress = {
  totalAttempts: 12,
  averageScore: 78,
  bestScore: 92,
  rank: 1247,
  badges: ["Problem Solver", "Quick Thinker", "Consistent Performer"],
  recentScores: [85, 78, 92, 76, 88],
};

// Upcoming competitions
const upcomingCompetitions = [
  {
    id: "1",
    name: "National Mathematics Olympiad",
    date: "2024-03-15",
    registrationDeadline: "2024-03-01",
    category: "Mathematics",
    level: "National",
    prize: "$10,000",
    participants: 5000,
  },
  {
    id: "2",
    name: "Regional Science Challenge",
    date: "2024-04-20",
    registrationDeadline: "2024-04-05",
    category: "Science",
    level: "Regional",
    prize: "$5,000",
    participants: 2500,
  },
  {
    id: "3",
    name: "International Coding Contest",
    date: "2024-05-10",
    registrationDeadline: "2024-04-25",
    category: "Computer Science",
    level: "International",
    prize: "$15,000",
    participants: 8000,
  },
];

export default function OlympiadPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, isClient]);

  const handleCategorySelect = (categoryId: string) => {
    // Navigate to category-specific preparation page
    router.push(`/olympiad/${categoryId}`);
  };

  const handleStartPractice = (categoryId: string) => {
    // Navigate to practice tests for the category
    router.push(`/olympiad/${categoryId}/practice`);
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Loading Olympiad
                </h1>
                <p className="text-muted-foreground">
                  Preparing your challenges...
                </p>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Olympiad Preparation
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Excel in academic competitions with our comprehensive preparation
              platform. Practice, compete, and achieve excellence in various
              olympiad categories.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {userProgress.totalAttempts}
                </div>
                <div className="text-sm text-muted-foreground">
                  Practice Tests
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {userProgress.averageScore}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  #{userProgress.rank}
                </div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {userProgress.badges.length}
                </div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </div>
            </div>
          </div>

          {/* Olympiad Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Choose Your Challenge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {olympiadCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {category.description}
                        </p>

                        {/* Category Details */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2" />
                            {category.duration}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            {category.participants}
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary" size="sm">
                              {subject}
                            </Badge>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartPractice(category.id);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Practice</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect(category.id);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <span>Learn More</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Upcoming Competitions */}
          <CompetitionsSection competitions={upcomingCompetitions} />

          {/* Resources Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground text-center mb-8">
              Preparation Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Study Materials
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive study guides, practice problems, and reference
                  materials for all olympiad categories.
                </p>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDFs</span>
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Practice Tests
                </h3>
                <p className="text-muted-foreground mb-4">
                  Timed practice tests that simulate real olympiad conditions
                  with detailed explanations.
                </p>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 mx-auto"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Practice</span>
                </Button>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Performance Analytics
                </h3>
                <p className="text-muted-foreground mb-4">
                  Track your progress, identify weak areas, and get personalized
                  recommendations.
                </p>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 mx-auto"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Analytics</span>
                </Button>
              </Card>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Your Achievements
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {userProgress.badges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gradient-to-r from-warning/10 to-warning/20 px-4 py-2 rounded-full border border-warning/30"
                >
                  <Star className="w-5 h-5 text-warning" />
                  <span className="text-warning font-medium">{badge}</span>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              View Full Progress
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
