import React from "react";

const ReviewPageSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 shadow-2xl animate-pulse">
      <div className="relative z-10 p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gray-300 dark:bg-gray-700 rounded-2xl shadow-lg h-20 w-20"></div>
            <div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
        </div>
        {/* Search Bar Skeleton */}
        <div className="h-14 bg-gray-300 dark:bg-gray-700 rounded-xl mb-6"></div>

        {/* Flashcard Skeleton */}
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-3xl mb-6"></div>

        {/* Navigation Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-12 w-28 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-12 w-28 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Card Gallery Skeleton */}
        <div className="flex space-x-2 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-16 bg-gray-300 dark:bg-gray-700 rounded-lg flex-shrink-0"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPageSkeleton;