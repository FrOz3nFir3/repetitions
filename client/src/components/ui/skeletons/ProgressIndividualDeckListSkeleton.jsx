const DeckCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
    <div className="p-6 flex-grow">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>

      <div className="space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 mt-auto">
      <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

const ProgressIndividualDeckListSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DeckCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndividualDeckListSkeleton;
