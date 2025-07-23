import React from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

const SearchBar = ({ searchTerm, handleSearchChange, handleSearchReset }) => (
  <div className="mb-10">
    <div className="relative group">
      {/* Enhanced background with gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-3xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl border-2 border-blue-200/50 dark:border-blue-700/50 shadow-2xl group-hover:shadow-3xl transition-all duration-300">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search your flashcards..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-16 py-5 text-lg font-medium border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 rounded-3xl"
        />

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleSearchReset}
            className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Indicator */}
      {searchTerm && (
        <div className="absolute -bottom-8 left-6 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
          Searching for "{searchTerm}"
        </div>
      )}
    </div>
  </div>
);

export default SearchBar;
