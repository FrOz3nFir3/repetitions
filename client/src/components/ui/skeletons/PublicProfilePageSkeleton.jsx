import React from "react";
import CardGridSkeleton from "./CardGridSkeleton";

const PublicProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto 2xl:max-w-7xl p-4 animate-pulse">
        {/* User header skeleton */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-3xl shadow-2xl"></div>
          </div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 mx-auto"></div>
        </div>

        {/* Cards section skeleton */}
        <div className="mt-12">
          <div className="h-9 bg-gray-300 dark:bg-gray-700 rounded-lg w-48 mb-6"></div>
          <CardGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePageSkeleton;
