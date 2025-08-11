import React from 'react';

export const ChapterCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-100 opacity-30 rounded-bl-full"></div>
      <div className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full"></div>

      {/* Chapter Icon Skeleton */}
      <div className="mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Chapter Info Skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        
        {/* Progress Bar Skeleton */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-8"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ChapterCardSkeleton;