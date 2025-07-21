import React from "react";
import FlashcardControls from "./FlashcardControls";
import FlashcardNavigation from "./FlashcardNavigation";
import FlashcardList from "./FlashcardList";

const FlashcardManagementView = ({
  searchTerm,
  handleSearchChange,
  handleReset,
  handlePrev,
  handleNext,
  handleJump,
  currentIndex,
  totalCount,
  jumpToIndex,
  handleJumpInputChange,
  currentFlashcard,
  cardId,
  animationDirection,
}) => {
  return (
    <div>
      <FlashcardControls
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {totalCount > 0 && (
        <FlashcardNavigation
          onPrev={handlePrev}
          onNext={handleNext}
          onJump={handleJump}
          currentIndex={currentIndex}
          totalCount={totalCount}
          jumpToIndex={jumpToIndex}
          onJumpInputChange={handleJumpInputChange}
          disabled={totalCount <= 1}
        />
      )}

      <div className="relative overflow-hidden">
        <FlashcardList
          flashcard={currentFlashcard}
          cardId={cardId}
          direction={animationDirection}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default FlashcardManagementView;
