import React, { lazy } from "react";

const ReviewPageSkeleton = lazy(() => import("./ReviewPageSkeleton"));
const QuizPageSkeleton = lazy(() => import("./QuizPageSkeleton"));
const EditPageSkeleton = lazy(() => import("./EditCardPageSkeleton"));
const IndividualCardOverviewPageSkeleton = lazy(() =>
  import("./IndividualCardOverviewPageSkeleton")
);

const IndividualCardPageSkeleton = ({ isFocusedActivity, view }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
        <div
          className={`grid grid-cols-1 ${
            isFocusedActivity ? "" : "lg:grid-cols-3"
          } gap-8`}
        >
          {!isFocusedActivity && (
            <div className="lg:col-span-1 space-y-6">
              {/* CardInfo Skeleton */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="mt-8 space-y-4">
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg w-full"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-lg w-full"></div>
                </div>
              </div>
              {/* CardLogs Skeleton */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className={`${isFocusedActivity ? "" : "lg:col-span-2"}`}>
            {view === "review" && <ReviewPageSkeleton />}
            {view === "quiz" && <QuizPageSkeleton />}
            {view === "edit" && <EditPageSkeleton />}
            {view === "overview" && <IndividualCardOverviewPageSkeleton />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualCardPageSkeleton;
