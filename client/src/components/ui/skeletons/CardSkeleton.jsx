import React from "react";

const CardSkeleton = () => {
  return (
    <div className="relative z-10 container mx-auto px-4 animate-pulse">
      {/* Header Section Skeleton */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 max-w-xs">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
      </div>

      {/* Search and Action Bar Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full lg:w-1/2"></div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-28"></div>
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-36"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeletonItem key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Controls Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const CardSkeletonItem = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-full flex flex-col overflow-hidden">
      <div className="p-6 flex-grow">
        {/* Main Topic Skeleton */}
        <div className="mb-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>

        {/* Sub Topic Skeleton */}
        <div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
