import React from "react";

const DetailedReportModalSkeleton = () => {
  return (
    <>
      {/* Header Skeleton (Not Sticky in Skeleton) */}
      <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 rounded-t-2xl sm:rounded-t-3xl">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 sm:p-3 bg-gray-300 dark:bg-gray-700 rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0 w-9 h-9 sm:w-13 sm:h-13"></div>
              <div className="min-w-0 flex-1">
                <div className="h-5 sm:h-7 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="h-9 w-9 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse flex-shrink-0"></div>
          </div>

          {/* Card Details Skeleton */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 dark:border-gray-700/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Category Skeleton */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"></div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse mb-1"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Main Topic Skeleton */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"></div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20 animate-pulse mb-1"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                </div>
              </div>

              {/* Sub Topic Skeleton */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"></div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-18 animate-pulse mb-1"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-22 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        {/* Sticky Navigation Skeleton */}
        <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 border-b border-white/20 dark:border-gray-700/20">
          <div className="px-3 sm:px-6 py-3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/40 dark:border-gray-700/40 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 sm:h-12 sm:w-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>

                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  <div className="h-7 sm:h-8 bg-gray-300 dark:bg-gray-700 rounded-xl w-28 animate-pulse"></div>
                </div>

                <div className="h-9 w-9 sm:h-12 sm:w-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="px-3 sm:px-6 py-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse flex-shrink-0 w-9 h-9"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-40 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/20 dark:to-gray-700/20 rounded-xl p-3 text-center border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-1 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Content Skeleton */}
        <div className="px-3 sm:px-6 pb-6 overflow-x-hidden">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 dark:border-gray-700/30">
            {/* Question Header Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gray-300 dark:bg-gray-700 rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14"></div>
                <div>
                  <div className="h-5 sm:h-7 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                </div>
              </div>

              {/* Question Content Skeleton */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                <div className="space-y-3">
                  <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-full animate-pulse"></div>
                  <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 sm:h-5 bg-gray-300 dark:bg-gray-600 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Answer Options Skeleton */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-gray-300 dark:bg-gray-700 rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14"></div>
                <div>
                  <div className="h-5 sm:h-7 bg-gray-300 dark:bg-gray-600 rounded w-32 animate-pulse mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      i === 1
                        ? "bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800/30 dark:to-emerald-800/30 border-green-300 dark:border-green-600"
                        : "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="relative z-10 p-4 sm:p-6 flex items-center">
                      {/* Option Letter Skeleton */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl mr-3 sm:mr-4 animate-pulse ${
                          i === 1
                            ? "bg-white/30 dark:bg-white/20"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      ></div>

                      {/* Option Content Skeleton */}
                      <div className="min-w-0 flex-1">
                        <div
                          className={`h-4 sm:h-5 rounded w-full animate-pulse mb-2 ${
                            i === 1
                              ? "bg-white/40 dark:bg-white/30"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        <div
                          className={`h-4 sm:h-5 rounded w-2/3 animate-pulse ${
                            i === 1
                              ? "bg-white/40 dark:bg-white/30"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                      </div>

                      {/* Correct Answer Badge Skeleton */}
                      {i === 1 && (
                        <div className="flex-shrink-0 ml-3 sm:ml-4">
                          <div className="h-4 w-4 sm:h-5 sm:w-5 bg-white/40 rounded animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint Text Skeleton */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
                <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedReportModalSkeleton;
