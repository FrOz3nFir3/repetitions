import React from "react";

const AuthenticationPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mx-auto mb-6"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Benefits Section Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Guest Features Skeleton */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mr-4"></div>
                  <div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                      <div className="w-full">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Member Features Skeleton */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mr-4"></div>
                  <div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                      <div className="w-full">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Form Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white/95 dark:bg-gray-800/95 py-8 px-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-2xl mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  <div className="h-12 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
                </div>
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white dark:bg-gray-800 text-transparent">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPageSkeleton;
