const IndividualCardOverviewPageSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mx-auto mb-4"></div>
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mx-auto mb-4"></div>
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mx-auto mb-4"></div>
        <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mx-auto mb-4"></div>
      </div>
    </div>
  );
};

export default IndividualCardOverviewPageSkeleton;
