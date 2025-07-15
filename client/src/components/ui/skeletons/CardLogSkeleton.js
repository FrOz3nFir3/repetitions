import React from "react";

const CardLogSkeleton = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm p-3 animate-pulse">
      <div className="flex items-center">
        <div className="flex-grow">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="flex gap-2 items-center mt-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
        </div>
        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
      </div>
    </div>
  );
};

export default CardLogSkeleton;
