import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ReviewQueueControls = ({
  searchTerm,
  onSearchChange,
  totalCount,
  filteredCount,
}) => {
  const handleReset = () => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: { value: "" },
    };
    onSearchChange(syntheticEvent);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search review items..."
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={handleReset}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Count Display */}
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            {searchTerm ? (
              <>
                Showing{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {filteredCount}
                </span>{" "}
                of <span className="font-semibold">{totalCount}</span> review
                items
              </>
            ) : (
              <>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {totalCount}
                </span>{" "}
                review items
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewQueueControls;
