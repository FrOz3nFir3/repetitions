import React from 'react';

const CardGridSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden animate-pulse">
          <div className="p-6 flex-grow">
            {/* Category skeleton */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-1"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            {/* Main topic skeleton */}
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            {/* Sub topic skeleton */}
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
          {/* Footer skeleton */}
          <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardGridSkeleton;