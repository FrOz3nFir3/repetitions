import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const FlashcardNavigation = ({
  onPrev,
  onNext,
  onJump,
  currentIndex,
  totalCount,
  disabled,
}) => (
  <div>
    {/* Main Navigation Controls */}
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Left: Navigation Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={disabled || currentIndex === 0}
          className="group cursor-pointer relative p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 transition-all duration-300"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
              Previous
            </span>
          </div>
        </button>

        {/* Card Counter */}
        <div className="text-2xl space-x-4 dark:text-white">
          <strong className="text-indigo-500">{currentIndex + 1}</strong> of{" "}
          {totalCount}
        </div>

        <button
          onClick={onNext}
          disabled={disabled || currentIndex === totalCount - 1}
          className="group cursor-pointer relative p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 transition-all duration-300"
        >
          <ChevronRightIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
              Next
            </span>
          </div>
        </button>
      </div>

      {/* Right: Jump to Card */}
      <div className="flex flex-wrap justify-center  items-center gap-3">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Jump to card:
        </div>
        <form onSubmit={onJump} className="flex items-center gap-3">
          <div className="relative">
            <input
              name="jumpToIndex"
              type="number"
              min="1"
              max={totalCount}
              className="w-20 px-4 py-2 text-center text-lg font-semibold border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 shadow-lg transition-all duration-300"
              placeholder={`${totalCount}`}
            />
          </div>
          <button
            type="submit"
            className="group cursor-pointer flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Go
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </form>
      </div>
    </div>
  </div>
);

export default FlashcardNavigation;
