import React from "react";
import ProgressIndividualDeckListSkeleton from "./ProgressIndividualDeckListSkeleton";

const ProgressPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Header Skeleton */}
          <div className="text-center mb-16 animate-pulse">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-[500px] mx-auto"></div>
          </div>

          {/* Overall Stats Skeleton */}
          <div className="mb-12 animate-pulse">
            <div className="text-center mb-8">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 border border-gray-300 dark:border-gray-700">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>

          {/* Decks Section Skeleton */}
          <div className="mb-16 animate-pulse">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl"></div>
              </div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-[600px] mx-auto"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="h-14 bg-gray-300 dark:bg-gray-700 rounded-2xl flex-1 max-w-2xl"></div>
              <div className="flex gap-6">
                <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>

            <ProgressIndividualDeckListSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPageSkeleton;
