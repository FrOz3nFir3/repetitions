import React from "react";

const ProfilePageSkeleton = () => {
  return (
    <div className="container mx-auto 2xl:max-w-7xl p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>

        <div className="space-y-4">
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24 mt-4"></div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
