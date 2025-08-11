import React from 'react';
import { Loader2, BookOpen, Clock, BarChart3, Users } from 'lucide-react';

const StartQuizLoading: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div>
              <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="h-6 bg-gray-300 rounded w-96"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[BookOpen, Clock, BarChart3, Users].map((Icon, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg animate-pulse">
                <Icon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Loading Quiz</h2>
              <p className="text-gray-600">Preparing your questions...</p>
            </div>
          </div>

          {/* Instructions Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="bg-gray-50 border rounded-lg p-4">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="text-center animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartQuizLoading;