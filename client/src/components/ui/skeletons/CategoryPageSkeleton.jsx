const CategoryPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 animate-pulse">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section Skeleton */}
        <div className="text-center my-16">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto"></div>
        </div>

        {/* Categories Section Skeleton */}
        <div className="mb-16">
          {/* Search and Create Bar Skeleton */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full lg:w-1/2"></div>
            <div className="flex items-center gap-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl w-40"></div>
            </div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[180px] bg-white dark:bg-gray-800 rounded-2xl"
              ></div>
            ))}
          </div>

          {/* Pagination Controls Skeleton */}
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
  );
};

export default CategoryPageSkeleton;
