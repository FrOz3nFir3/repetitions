import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FlashcardControls = ({ searchTerm, onSearchChange, onReset }) => (
  <div>
    {/* Search Header */}
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
          Flashcard Explorer
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Search or navigate through your flashcards to quickly find what you need
        to edit.
      </p>
    </div>

    {/* Enhanced Search Input */}
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by questions or answers..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-14 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </div>

    {/* Search Results Indicator */}
    {searchTerm && (
      <div className="mt-4 flex-wrap flex items-center justify-center sm:justify-between">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Searching for "{searchTerm}"
          </span>
        </div>
        <button
          onClick={onReset}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
        >
          <XMarkIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
          Clear search
        </button>
      </div>
    )}
  </div>
);

export default FlashcardControls;
