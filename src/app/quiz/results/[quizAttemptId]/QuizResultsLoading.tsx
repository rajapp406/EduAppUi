import { Loader2 } from 'lucide-react';

export function QuizResultsLoading() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
        </div>
        
        {/* Score Summary Skeleton */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-24 mx-auto mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold mb-2">Loading Quiz Results</h2>
            <p className="text-gray-600">Please wait while we fetch your results...</p>
          </div>
        </div>

        {/* Questions Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border bg-gray-50 animate-pulse">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
                <div className="ml-3 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}