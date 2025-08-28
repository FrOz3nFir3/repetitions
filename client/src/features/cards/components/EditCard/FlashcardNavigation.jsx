import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import NavigationDropdown from "./NavigationDropdown";
import { getTextFromHtml } from "../../../../utils/dom";

const FlashcardNavigation = ({
  onPrev,
  onNext,
  onJump,
  currentIndex,
  reviewMap,
  totalCount,
  searchTerm,
  disabled,
  flashcards = [],
  onFlashcardSelect,
}) => {
  const getFlashcardLabel = (flashcard, index) => {
    const originalIndex = reviewMap.get(flashcard._id);
    return `Flashcard ${originalIndex + 1}`;
  };

  const getFlashcardDescription = (flashcard) => {
    if (!flashcard?.question) return "";
    const plainText = getTextFromHtml(flashcard.question);
    return plainText;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg p-4">
      {/* Main Navigation Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onPrev}
            disabled={disabled || currentIndex === 0}
            className="group cursor-pointer relative p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 transition-all duration-300"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                Previous
              </span>
            </div>
          </button>

          {/* Card Counter */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700">
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {currentIndex + 1} of {totalCount}
            </span>
            {searchTerm && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
                (filtered)
              </span>
            )}
          </div>

          <button
            onClick={onNext}
            disabled={disabled || currentIndex === totalCount - 1}
            className="group cursor-pointer relative p-2 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:hover:translate-y-0 transition-all duration-300"
          >
            <ChevronRightIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                Next
              </span>
            </div>
          </button>
        </div>

        {/* Right: Go to Flashcard Dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Go to:
          </div>
          <NavigationDropdown
            items={flashcards}
            currentIndex={currentIndex}
            onItemSelect={onFlashcardSelect}
            placeholder="Select flashcard..."
            getItemLabel={getFlashcardLabel}
            getItemDescription={getFlashcardDescription}
            type="flashcard"
          />
        </div>
      </div>
    </div>
  );
};

export default FlashcardNavigation;
