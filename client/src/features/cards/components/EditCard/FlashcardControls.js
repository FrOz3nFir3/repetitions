import React from "react";
import {
  MagnifyingGlassIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

const FlashcardControls = ({
  searchTerm,
  onSearchChange,
  onReset,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="relative flex-grow w-full md:w-auto">
      <input
        type="text"
        placeholder="Search questions or answers..."
        value={searchTerm}
        onChange={onSearchChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
    </div>
    {searchTerm && (
      <button
        onClick={onReset}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <ArrowUturnLeftIcon className="h-4 w-4" />
        Reset
      </button>
    )}
  </div>
);

export default FlashcardControls;
