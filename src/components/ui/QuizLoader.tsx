import React from 'react';
import { Loader2, BookOpen, Clock, Users } from 'lucide-react';

interface QuizLoaderProps {
  message?: string;
  showDetails?: boolean;
  type?: 'quiz' | 'list' | 'question';
}

export const QuizLoader: React.FC<QuizLoaderProps> = ({ 
  message = "Loading...", 
  showDetails = false,
  type = 'quiz'
}) => {
  const getLoaderContent = () => {
    switch (type) {
      case 'quiz':
        return {
          icon: <BookOpen className="w-8 h-8 text-blue-500" />,
          title: "Loading Quiz",
          subtitle: "Preparing your questions..."
        };
      case 'list':
        return {
          icon: <Users className="w-8 h-8 text-green-500" />,
          title: "Loading Quizzes",
          subtitle: "Fetching available quizzes..."
        };
      case 'question':
        return {
          icon: <Clock className="w-8 h-8 text-orange-500" />,
          title: "Loading Question",
          subtitle: "Getting next question ready..."
        };
      default:
        return {
          icon: <BookOpen className="w-8 h-8 text-blue-500" />,
          title: "Loading",
          subtitle: message
        };
    }
  };

  const content = getLoaderContent();

  if (!showDetails) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping">
            {content.icon}
          </div>
          <div className="relative">
            {content.icon}
          </div>
        </div>

        {/* Spinner */}
        <div className="mb-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {content.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {content.subtitle}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for quiz cards
export const QuizCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

// Skeleton loader for quiz list
export const QuizListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <QuizCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Question skeleton loader
export const QuestionSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};