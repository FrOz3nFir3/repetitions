import React from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const CategorySearch = ({
  searchQuery,
  onSearchChange,
  onShowCreateForm,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8 p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
        />
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              onClick={() => onSearchChange({ target: { value: "" } })}
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
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            {filteredCount} of {totalCount}
            {searchQuery && " found"}
          </span>
        </div>
        <button
          onClick={onShowCreateForm}
          className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          New Category
        </button>
      </div>
    </div>
  );
};

export default CategorySearch;
