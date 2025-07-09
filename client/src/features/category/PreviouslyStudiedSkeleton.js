import React from "react";

const CardSkeletonItem = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="mt-4 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

const PreviouslyStudiedSkeleton = () => {
  return (
    <div className="mt-8">
      <div className="my-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
      </div>
      <div className="my-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeletonItem key={i} />
        ))}
      </div>
    </div>
  );
};

export default PreviouslyStudiedSkeleton;
