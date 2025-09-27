const CardsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 animate-pulse">
      <div className="relative z-10 container mx-auto 2xl:max-w-7xl px-4 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>

        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-slate-900/50 dark:to-indigo-950/30 py-16 rounded-3xl">
          <div className="relative z-10 container mx-auto 2xl:max-w-7xl px-4">
            {/* Header Section Skeleton */}
            <div className="text-center mb-12">
              {/* Category Badge Skeleton */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="flex flex-col items-start gap-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>

              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
            </div>

            {/* Search and Action Bar Skeleton */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full lg:w-1/2"></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-32"></div>
              </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[200px] bg-gray-300 dark:bg-gray-700 rounded-2xl"
                  ></div>
                ))}
              </div>
            </div>

            {/* Pagination Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsPageSkeleton;
