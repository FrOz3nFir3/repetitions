import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const FlashcardNavigation = ({
  onPrev,
  onNext,
  onJump,
  currentIndex,
  totalCount,
  jumpToIndex,
  onJumpInputChange,
  disabled,
}) => (
  <div className="my-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <button
        onClick={onPrev}
        disabled={disabled}
        className="cursor-pointer p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
      <span className="font-semibold text-gray-800 dark:text-white">
        Card {currentIndex + 1} of {totalCount}
      </span>
      <button
        onClick={onNext}
        disabled={disabled}
        className="cursor-pointer p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-800 dark:text-white" />
      </button>
    </div>

    <form onSubmit={onJump} className="flex items-center gap-2">
      <input
        type="number"
        min="1"
        max={totalCount}
        value={jumpToIndex}
        onChange={onJumpInputChange}
        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Go to"
      />
      <button
        type="submit"
        className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go
      </button>
    </form>
  </div>
);

export default FlashcardNavigation;
