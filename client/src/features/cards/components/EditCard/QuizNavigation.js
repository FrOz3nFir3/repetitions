import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const QuizNavigation = ({
  onPrev,
  onNext,
  onJump,
  currentIndex,
  totalCount,
  disabled,
  searchTerm,
  selectedFlashcardId,
}) => {
  const [jumpValue, setJumpValue] = useState("");

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    onJump(e);
    setJumpValue("");
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={disabled || currentIndex === 0}
            className="cursor-pointer group relative p-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500  disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                Previous
              </span>
            </div>
          </button>

          <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
            <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
              {currentIndex + 1} of {totalCount}
            </span>
            {(searchTerm || selectedFlashcardId) && (
              <span className="text-xs text-purple-600 dark:text-purple-400 ml-2">
                (filtered)
              </span>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={disabled || currentIndex === totalCount - 1}
            className="cursor-pointer group relative p-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500  disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ChevronRightIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                Next
              </span>
            </div>
          </button>
        </div>

        {/* Right: Jump to Quiz */}
        <form
          onSubmit={handleJumpSubmit}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Jump to:
          </span>
          <input
            type="number"
            name="jumpToIndex"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            min="1"
            max={totalCount}
            className="w-20 px-3 py-2 text-sm text-center border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            placeholder={`${totalCount}`}
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizNavigation;
