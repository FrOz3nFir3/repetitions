import React from "react";
import {
  ArrowsRightLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

import SearchBar from "./SearchBar";
import Flashcard from "./Flashcard";
import Navigation from "./Navigation";
import CardGallery from "./CardGallery";
import ReviewTips from "./ReviewTips";
import ConfidenceRater from "./ConfidenceRater";
import ReviewCompletion from "./ReviewCompletion";
import ReviewHeader from "./ReviewHeader";

const ReviewSession = ({
  review,
  searchTerm,
  handleSearchChange,
  handleSearchReset,
  session,
}) => {
  const {
    currentIndex,
    currentFlashcard,
    isFlipped,
    slideDirection,
    showConfidenceRating,
    showCompletion,
    completedCards,
    sessionCards,
    handleNext,
    handlePrev,
    handleCardSelect,
    handleFlipCard,
    handleConfidenceRating,
    restartReview,
  } = session;

  const getSlideClass = () => {
    switch (slideDirection) {
      case "left":
        return "transform -translate-x-full transition-transform duration-300 ease-in-out";
      case "right":
        return "transform translate-x-full transition-transform duration-300 ease-in-out";
      case "in-right":
        return "transform translate-x-0 transition-transform duration-300 ease-in-out";
      case "in-left":
        return "transform translate-x-0 transition-transform duration-300 ease-in-out";
      default:
        return "";
    }
  };

  const progressPercentage =
    sessionCards.length > 0
      ? ((currentIndex + 1) / sessionCards.length) * 100
      : 0;

  return (
    <div className="relative z-10 p-6 sm:p-8">
      <ReviewHeader />
      {!showCompletion && (
        <SearchBar
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchReset={handleSearchReset}
        />
      )}
      {!showCompletion ? (
        <Flashcard
          currentFlashcard={currentFlashcard}
          isFlipped={isFlipped}
          setIsFlipped={handleFlipCard}
          getSlideClass={getSlideClass}
          currentIndex={currentFlashcard?.originalIndex ?? 0}
          totalCards={review.length}
          showFeedbackIndicator={isFlipped && showConfidenceRating}
          isReviewCard={currentFlashcard?.isReview}
        />
      ) : (
        <ReviewCompletion
          onRestart={restartReview}
          completedCardsCount={completedCards.size}
        />
      )}

      {isFlipped &&
        showConfidenceRating &&
        currentFlashcard &&
        !showCompletion && <ConfidenceRater onRate={handleConfidenceRating} />}

      {!!sessionCards.length && !showCompletion && (
        <>
          <div className="text-center mt-6 mb-4">
            <div className="hidden md:flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2">
              <ArrowsRightLeftIcon className="h-4 w-4" />
              Use Left/Right arrow keys to navigate
            </div>
          </div>
          <Navigation
            handlePrev={handlePrev}
            handleNext={handleNext}
            currentIndex={currentIndex}
            filteredReviewLength={sessionCards.length}
            progressPercentage={progressPercentage}
            showEditIcon={!currentFlashcard?.isReview}
          />
          <CardGallery
            review={review}
            filteredReview={sessionCards}
            currentFlashcard={currentFlashcard}
            handleCardSelect={handleCardSelect}
            searchTerm={searchTerm}
          />
        </>
      )}
    </div>
  );
};

export default ReviewSession;
