import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { selectCurrentCard } from "../../state/cardSlice";
import {
  ArrowsRightLeftIcon,
  BookOpenIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import SearchBar from "./Review/SearchBar";
import Flashcard from "./Review/Flashcard";
import Navigation from "./Review/Navigation";
import CardGallery from "./Review/CardGallery";
import ReviewTips from "./Review/ReviewTips";
import ConfidenceRater from "./Review/ConfidenceRater";
import ReviewCompletion from "./Review/ReviewCompletion";
import { useSearchParams } from "react-router-dom";

function Review() {
  const [searchParams, setSearchParams] = useSearchParams();

  const card = useSelector(selectCurrentCard);
  const { review = [] } = card ?? {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [showConfidenceRating, setShowConfidenceRating] = useState(false);
  const [cardFeedback, setCardFeedback] = useState({});
  const [reviewCards, setReviewCards] = useState([]);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const filteredReview = useMemo(() => {
    let baseCards = review;
    if (searchTerm) {
      baseCards =
        review?.filter(
          (item) =>
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ) ?? [];
      // Return only original cards when searching (no review cards)
      return baseCards.map((card, index) => ({
        ...card,
        originalIndex: review.findIndex(
          (originalCard) => originalCard.question === card.question
        ),
        urlCardNo:
          review.findIndex(
            (originalCard) => originalCard.question === card.question
          ) + 1,
      }));
    }

    // Add original cards with proper indexing
    const cardsWithOriginalIndex = baseCards.map((card, index) => ({
      ...card,
      originalIndex: index,
      urlCardNo: index + 1,
    }));

    // Append review cards at the end (much simpler!)
    const reviewCardsWithMeta = reviewCards.map((card) => ({
      ...card,
      isReview: true,
      originalIndex: review.findIndex(
        (originalCard) => originalCard.question === card.question
      ),
      // Review cards don't have urlCardNo (edit disabled)
    }));

    return [...cardsWithOriginalIndex, ...reviewCardsWithMeta];
  }, [review, searchTerm, reviewCards]);

  const currentFlashcard = filteredReview[currentIndex];

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  useEffect(() => {
    const cardNo = cardNoQuery;

    // If no cardNo in URL, start from beginning
    if (Number.isNaN(cardNo)) {
      setCurrentIndex(0);
      handleSetSearchParams("cardNo", "1");
      return;
    }

    // Simple mapping: cardNo directly corresponds to original card index
    const targetIndex = cardNo - 1;
    if (targetIndex >= 0 && targetIndex < review.length) {
      setCurrentIndex(targetIndex);
    } else {
      // If cardNo is out of bounds, go to first card
      setCurrentIndex(0);
      handleSetSearchParams("cardNo", "1");
    }
  }, [cardNoQuery, review.length]);

  const handleSetSearchParams = (key, value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setIsFlipped(false);
    setShowConfidenceRating(false);
    setShowCompletion(false);
    setSearchTerm(value);
    handleSetSearchParams("search", value);
    handleSetSearchParams("cardNo", "1");
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setIsFlipped(false);
    setShowConfidenceRating(false);
    setShowCompletion(false);
    handleSetSearchParams("search", "");
    handleSetSearchParams("cardNo", "1");
    setCurrentIndex(0);
  };

  const handleNext = useCallback(() => {
    if (filteredReview.length === 0) return;

    // Check if we can go to next card
    const isLastCard = currentIndex === filteredReview.length - 1;

    if (isLastCard && !searchTerm) {
      // Only show completion if there are no more cards to review
      setShowCompletion(true);
      return;
    }

    setIsFlipped(false);
    setShowConfidenceRating(false);
    setSlideDirection("left");
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % filteredReview.length;
      setCurrentIndex(newIndex);
      const nextCard = filteredReview[newIndex];
      // Only update URL for original cards (not review cards)
      if (nextCard && !nextCard.isReview && nextCard.urlCardNo) {
        handleSetSearchParams("cardNo", nextCard.urlCardNo.toString());
      }
      setSlideDirection("in-right");
    }, 150);
  }, [currentIndex, filteredReview, searchTerm]);

  const handlePrev = useCallback(() => {
    if (filteredReview.length === 0) return;
    setIsFlipped(false);
    setShowConfidenceRating(false);
    setSlideDirection("right");
    setTimeout(() => {
      const newIndex =
        (currentIndex - 1 + filteredReview.length) % filteredReview.length;
      setCurrentIndex(newIndex);
      const prevCard = filteredReview[newIndex];
      // Only update URL for original cards (not review cards)
      if (prevCard && !prevCard.isReview && prevCard.urlCardNo) {
        handleSetSearchParams("cardNo", prevCard.urlCardNo.toString());
      }
      setSlideDirection("in-left");
    }, 150);
  }, [currentIndex, filteredReview]);

  const handleCardSelect = (index) => {
    if (index === currentIndex) {
      setIsFlipped(!isFlipped);
      if (!isFlipped) {
        setShowConfidenceRating(true);
      }
      return;
    }
    setIsFlipped(false);
    setShowConfidenceRating(false);
    setSlideDirection(index > currentIndex ? "left" : "right");
    setTimeout(() => {
      setCurrentIndex(index);
      const selectedCard = filteredReview[index];
      // Only update URL for original cards (not review cards)
      if (selectedCard && !selectedCard.isReview && selectedCard.urlCardNo) {
        handleSetSearchParams("cardNo", selectedCard.urlCardNo.toString());
      }
      setSlideDirection(index > currentIndex ? "in-right" : "in-left");
    }, 150);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current) return;
    const touchCurrentX = e.touches[0].clientX;
    if (touchStartX.current - touchCurrentX > 50) {
      handleNext();
      isSwiping.current = false;
    } else if (touchStartX.current - touchCurrentX < -50) {
      handlePrev();
      isSwiping.current = false;
    }
  };

  const handleTouchEnd = () => {
    isSwiping.current = false;
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowConfidenceRating(true);
    }
  };

  const handleConfidenceRating = (rating) => {
    const cardId = currentFlashcard?.question || currentIndex;

    // Update feedback
    setCardFeedback((prev) => ({
      ...prev,
      [cardId]: rating,
    }));
    setShowConfidenceRating(false);

    // Check if we're adding a review card
    const willAddReviewCard = rating === "partial" || rating === "struggling";
    let cardWasAdded = false;

    // Add to review cards if not mastered
    if (willAddReviewCard) {
      setReviewCards((prev) => {
        if (currentFlashcard?.isReview) {
          // If this is already a review card, add it back to the end for another review
          cardWasAdded = true;
          return [...prev, { ...currentFlashcard, isReview: false }];
        } else {
          // If this is an original card, check for duplicates before adding
          const alreadyExists = prev.some(
            (card) =>
              card.question === currentFlashcard.question &&
              card.answer === currentFlashcard.answer
          );
          if (alreadyExists) {
            return prev; // Don't add duplicate
          }
          cardWasAdded = true;
          return [...prev, { ...currentFlashcard, isReview: false }];
        }
      });
    } else {
      // Mark as completed for "mastered"
      setCompletedCards((prev) => new Set([...prev, cardId]));
    }

    // Navigate with knowledge of whether we added a review card
    setTimeout(() => {
      handleNextWithContext(cardWasAdded);
    }, 300);
  };

  const handleNextWithContext = (justAddedReviewCard = false) => {
    if (filteredReview.length === 0) return;

    // Check if we can go to next card
    // If we just added a review card, we know there's at least one more card
    const effectiveLength = justAddedReviewCard
      ? filteredReview.length + 1
      : filteredReview.length;
    const isLastCard = currentIndex === effectiveLength - 1;

    if (isLastCard && !searchTerm && !justAddedReviewCard) {
      // Only show completion if there are no more cards to review
      setShowCompletion(true);
      return;
    }

    setIsFlipped(false);
    setShowConfidenceRating(false);
    setSlideDirection("left");
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % effectiveLength;
      setCurrentIndex(newIndex);
      const nextCard = filteredReview[newIndex];
      // Only update URL for original cards (not review cards)
      if (nextCard && !nextCard.isReview && nextCard.urlCardNo) {
        handleSetSearchParams("cardNo", nextCard.urlCardNo.toString());
      }
      setSlideDirection("in-right");
    }, 150);
  };

  const restartReview = () => {
    setShowCompletion(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSlideDirection("");
    setShowConfidenceRating(false);
    setReviewCards([]);
    setCompletedCards(new Set());
    setCardFeedback({});
    handleSetSearchParams("cardNo", "1");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") handleNext();
      else if (event.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

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

  if (!review || review?.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center py-16 px-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg inline-block mb-6">
            <InformationCircleIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-4">
            No Flashcards to Review
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Add some flashcards to get started with your learning journey.
          </p>
        </div>

        <div className="m-4 mt-8">
          <ReviewTips />
        </div>
      </div>
    );
  }

  const progressPercentage =
    filteredReview?.length > 0
      ? ((currentIndex + 1) / filteredReview.length) * 100
      : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <BookOpenIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                Review Session
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Study flashcards and rate your understanding
              </p>
            </div>
          </div>
        </div>
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
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
            currentIndex={currentFlashcard?.originalIndex ?? 0}
            totalCards={review.length}
            showFeedbackIndicator={isFlipped && showConfidenceRating}
            isReviewCard={currentFlashcard?.isReview}
            showEditIcon={!currentFlashcard?.isReview}
          />
        ) : (
          <ReviewCompletion
            onRestart={restartReview}
            completedCardsCount={completedCards.size}
          />
        )}

        {/* Confidence Rating - Outside the card */}
        {isFlipped &&
          showConfidenceRating &&
          currentFlashcard &&
          !showCompletion && (
            <ConfidenceRater onRate={handleConfidenceRating} />
          )}

        {!!filteredReview.length && !showCompletion && (
          <>
            <div className="text-center mt-6 mb-4">
              <div className="hidden md:flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2">
                <ArrowsRightLeftIcon className="h-4 w-4" />
                Use Left/Right arrow keys to navigate
              </div>
              {/* disabled left / right swipe due to overflow bug */}
              {/* <div className="md:hidden flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2">
                <InformationCircleIcon className="h-4 w-4" />
                Swipe left or right to navigate
              </div> */}
            </div>

            <Navigation
              handlePrev={handlePrev}
              handleNext={handleNext}
              currentIndex={currentIndex}
              filteredReviewLength={filteredReview.length}
              progressPercentage={progressPercentage}
              showEditIcon={!currentFlashcard?.isReview}
            />
            <CardGallery
              review={review}
              filteredReview={filteredReview}
              currentFlashcard={currentFlashcard}
              handleCardSelect={handleCardSelect}
              searchTerm={searchTerm}
            />
          </>
        )}
        {/* Review Tips Section */}
        <div className="mt-8">
          <ReviewTips />
        </div>
      </div>
    </div>
  );
}

export default Review;
