import React from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import SearchableDropdown from "../../components/ui/SearchableDropdown";

const QuizControls = ({
  searchTerm,
  onSearchChange,
  onReset,
  selectedFlashcardId,
  onFlashcardSelect,
  flashcardOptions,
  filteredCount,
  isLoadingFlashcards,
  onFlashcardDropdownOpen,
}) => {
  const handleSearchChange = (e) => {
    onSearchChange(e);
  };

  return (
    <div>
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
            Quiz Explorer
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Search through your quiz collection or filter by specific flashcards
          to find what you need.
        </p>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col x gap-4">
          {/* Search Input */}
          <div className="relative group flex-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search quiz questions, answers, or options..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-14 pr-12 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                  <MagnifyingGlassIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Dropdown make this ui better later*/}
          <div className="flex  gap-3 px-4">
            <div className="self-center p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl shadow-md">
              <FunnelIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <SearchableDropdown
                options={flashcardOptions}
                value={selectedFlashcardId}
                onChange={onFlashcardSelect}
                placeholder="Filter by flashcard..."
                isLoading={isLoadingFlashcards}
                onOpen={onFlashcardDropdownOpen}
              />
            </div>
          </div>
        </div>

        {/* Search Results and Actions */}
        {(searchTerm || selectedFlashcardId) && (
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {filteredCount === 0
                  ? "No quizzes found"
                  : `Found ${filteredCount} quiz${
                      filteredCount !== 1 ? "es" : ""
                    }`}
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            </div>
            <button
              onClick={() => {
                onFlashcardSelect(null);
                onReset();
              }}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
            >
              <XMarkIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizControls;
