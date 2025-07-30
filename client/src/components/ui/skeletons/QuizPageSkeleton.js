import React from "react";

const QuizPageSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl animate-pulse">
      <div className="relative z-10 p-6 sm:p-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-36"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-28"></div>
        </div>

        {/* Question Skeleton */}
        <div className="text-center my-8">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Hint Skeleton */}
        <div className="text-center mb-6">
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-80 mx-auto"></div>
        </div>

        {/* Options Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl"
            ></div>
          ))}
        </div>

        {/* Fun Facts Toggle Skeleton */}
        <div className="mt-8 mb-6 flex justify-center items-center">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-7 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPageSkeleton;