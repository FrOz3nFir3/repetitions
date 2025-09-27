import React from "react";
import ProgressIndividualDeckListSkeleton from "./ProgressIndividualDeckListSkeleton";

const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 flex items-center">
    <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md p-3 h-12 w-12"></div>
    <div className="ml-5 w-0 flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

const ProgressPageSkeleton = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen animate-pulse">
      <div className="container mx-auto 2xl:max-w-7xl px-4 !py-8">
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
        <ProgressIndividualDeckListSkeleton />
      </div>
    </div>
  );
};

export default ProgressPageSkeleton;
