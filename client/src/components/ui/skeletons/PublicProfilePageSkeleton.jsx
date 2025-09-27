import React from "react";
import CardGridSkeleton from "./CardGridSkeleton";

const PublicProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="container mx-auto 2xl:max-w-7xl p-4">
        {/* User header skeleton */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-3xl"></div>
          </div>
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mt-4"></div>
        </div>

        {/* Cards section skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <CardGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePageSkeleton;
