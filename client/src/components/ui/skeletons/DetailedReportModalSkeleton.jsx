import React from "react";

const DetailedReportModalSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="w-3/4">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse mb-3"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse mb-2"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
      </div>

      {/* Report List Skeleton */}
      <div className="overflow-y-auto pr-2 max-h-[60vh]">
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-lg shadow-md animate-pulse"
            >
              {/* Question Skeleton */}
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>

              {/* Options Skeleton */}
              <div className="mt-4 space-y-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700/50 rounded-md"></div>
                <div className="h-10 bg-green-100 dark:bg-green-800/50 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700/50 rounded-md"></div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailedReportModalSkeleton;
