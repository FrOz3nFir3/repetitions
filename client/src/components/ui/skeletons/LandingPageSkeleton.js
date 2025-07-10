import React from "react";

const LandingPageSkeleton = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-white dark:bg-gray-800 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-8"></div>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <div className="h-12 w-40 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <div className="h-12 w-40 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8 lg:pt-0">
          <div className="relative w-full h-96 max-w-lg sm:h-72 md:h-96">
            <div className="absolute top-0 left-1/4 w-64 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg transform -rotate-6"></div>
            <div className="absolute top-1/4 left-1/2 w-64 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg transform rotate-3"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg transform -rotate-2"></div>
            <div className="absolute top-3/4 left-1/2 w-64 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg transform rotate-5"></div>
          </div>
        </div>
      </div>

      {/* Feature Section Skeleton */}
      <div className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4 mx-auto"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6 mx-auto"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4 mx-auto"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mx-auto"></div>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg"
              >
                <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-md mb-6"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageSkeleton;
