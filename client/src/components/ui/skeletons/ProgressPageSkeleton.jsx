import React from "react";

const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 flex items-center">
    <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md p-3 h-12 w-12"></div>
    <div className="ml-5 w-0 flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const DeckCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
    <div className="p-6 flex-grow">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 mt-auto">
      <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

const ProgressPageSkeleton = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen animate-pulse">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 !py-12">
        <header className="my-10">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </header>

        {/* Overall Stats Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Individual Deck Progress Skeleton */}
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <DeckCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPageSkeleton;
