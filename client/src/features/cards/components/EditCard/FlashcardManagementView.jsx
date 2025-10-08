import React from "react";
import FlashcardControls from "./FlashcardControls";
import FlashcardNavigation from "./FlashcardNavigation";
import FlashcardList from "./FlashcardList";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const FlashcardManagementView = ({
  review,
  searchTerm,
  handleSearchChange,
  handleReset,
  handlePrev,
  handleNext,
  handleJump,
  currentIndex,
  totalCount,
  currentFlashcard,
  cardId,
  animationDirection,
  originalFlashcardIndex,
  filteredFlashcards = [],
  handleIndexChange,
  reviewMap = new Map(),
}) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto ">
      {/* Combined Search + Navigation Controls */}
      <div className="relative z-1 ">
        <div className="space-y-4">
          {/* Search Section */}
          <FlashcardControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onReset={handleReset}
            totalCount={totalCount}
            filteredCount={totalCount}
          />

          {/* Navigation Section - Only show if we have cards */}
          {totalCount > 0 && (
            <FlashcardNavigation
              onPrev={handlePrev}
              onNext={handleNext}
              onJump={handleJump}
              currentIndex={currentIndex}
              totalCount={totalCount}
              disabled={totalCount <= 1}
              searchTerm={searchTerm}
              flashcards={filteredFlashcards}
              reviewMap={reviewMap}
              onFlashcardSelect={(index) => {
                if (handleIndexChange) {
                  handleIndexChange(index);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Flashcard Content */}
      {totalCount > 0 ? (
        <div
          className={`transition-all duration-500  ${
            animationDirection === "left"
              ? "animate-slide-in-left"
              : animationDirection === "right"
              ? "animate-slide-in-right"
              : ""
          }`}
        >
          <FlashcardList
            review={review}
            flashcard={currentFlashcard}
            cardId={cardId}
            direction={animationDirection}
            currentIndex={currentIndex}
            originalFlashcardIndex={originalFlashcardIndex}
            key={currentIndex}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl inline-block mb-4">
            <BookOpenIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            No flashcards found
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm
              ? "Try different search terms or clear the search to see all cards."
              : "Create your first flashcard to get started!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardManagementView;
