import React from "react";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const StudiedDecksControls = ({
  searchQuery,
  setSearchQuery,
  totalCount,
  filteredCount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8 p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="self-stretch relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <MagnifyingGlassIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <input
          type="text"
          placeholder="Search cards in your progress..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              onClick={() => setSearchQuery("")}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              {totalCount} total
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {filteredCount} showing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudiedDecksControls;
