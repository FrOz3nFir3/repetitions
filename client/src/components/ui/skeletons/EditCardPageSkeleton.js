import React from "react";

const EditCardPageSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>

      {/* View Switcher Skeleton */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="h-12 w-36 bg-gray-300 dark:bg-gray-700 rounded-t-lg mr-2"></div>
        <div className="h-12 w-36 bg-gray-300 dark:bg-gray-700 rounded-t-lg"></div>
      </div>

      {/* Management View Skeleton */}
      <div>
        {/* Search and Controls Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-12 w-2/5 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Item Skeleton */}
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-2xl mb-6"></div>

        {/* Navigation Skeleton */}
        <div className="flex justify-center items-center gap-4">
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default EditCardPageSkeleton;