import React from "react";

const LandingPageSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-12 lg:py-20">
            {/* Left Content Skeleton */}
            <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-4"></div>
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-6"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-2xl mx-auto lg:mx-0 mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6 max-w-2xl mx-auto lg:mx-0 mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <div className="h-16 w-56 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                <div className="h-16 w-56 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              </div>
            </div>

            {/* Right Content Skeleton - Corrected Stack */}
            <div className="lg:w-1/2 mt-16 lg:mt-0 flex items-center justify-center px-4">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-80 sm:h-96 lg:h-[500px]">
                <div
                  className="absolute w-72 h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-2xl"
                  style={{
                    zIndex: 1,
                    top: "35%",
                    left: "50%",
                    transform: "translateX(-50%) rotate(2deg) scale(0.95)",
                  }}
                ></div>
                <div
                  className="absolute w-72 h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-2xl"
                  style={{
                    zIndex: 2,
                    top: "32%",
                    left: "50%",
                    transform: "translateX(-40%) rotate(5deg)",
                  }}
                ></div>
                <div
                  className="absolute w-72 h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-2xl"
                  style={{
                    zIndex: 3,
                    top: "32%",
                    left: "50%",
                    transform: "translateX(-60%) rotate(-5deg)",
                  }}
                ></div>
                <div
                  className="absolute w-72 h-44 bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-2xl"
                  style={{
                    zIndex: 4,
                    top: "30%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="relative py-24 sm:py-32 bg-white dark:bg-gray-800">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-6"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-2xl mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl h-64"
              >
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works & CTA Skeleton */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageSkeleton;
