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
import { useSearchParams } from "react-router-dom";

function Review() {
  const [searchParams, setSearchParams] = useSearchParams();

  const card = useSelector(selectCurrentCard);
  const { review = [] } = card;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const filteredReview = useMemo(() => {
    if (!searchTerm) return review;
    return review.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [review, searchTerm]);

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  useEffect(() => {
    const cardNo = cardNoQuery;
    const outOfBounds = cardNo > filteredReview.length || cardNo <= 0;
    // delete cardNo if no flashcards match the search
    if (filteredReview.length === 0) {
      handleSetSearchParams("cardNo", "");
      return;
    }
    if (Number.isNaN(cardNo)) {
      handleSetSearchParams("cardNo", "1");
      return;
    }
    if (outOfBounds) {
      const validIndex =
        (cardNo - 1 + filteredReview.length) % filteredReview.length;
      handleSetSearchParams("cardNo", (validIndex + 1).toString());
      return;
    }

    setCurrentIndex(cardNo - 1);
  }, [cardNoQuery, filteredReview.length]);

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
    setSearchTerm(value);
    handleSetSearchParams("search", value);
    handleSetSearchParams("cardNo", "1");
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setIsFlipped(false);
    handleSetSearchParams("search", "");
    handleSetSearchParams("cardNo", "1");
    setCurrentIndex(0);
  };

  const handleNext = useCallback(() => {
    if (filteredReview.length === 0) return;
    setIsFlipped(false);
    setSlideDirection("left");
    setTimeout(() => {
      const newIndex = (currentIndex + 1) % filteredReview.length;
      setCurrentIndex(newIndex);
      handleSetSearchParams("cardNo", (newIndex + 1).toString());
      setSlideDirection("in-right");
    }, 150);
  }, [currentIndex, filteredReview.length]);

  const handlePrev = useCallback(() => {
    if (filteredReview.length === 0) return;
    setIsFlipped(false);
    setSlideDirection("right");
    setTimeout(() => {
      const newIndex =
        (currentIndex - 1 + filteredReview.length) % filteredReview.length;
      setCurrentIndex(newIndex);
      handleSetSearchParams("cardNo", (newIndex + 1).toString());
      setSlideDirection("in-left");
    }, 150);
  }, [currentIndex, filteredReview.length]);

  const handleCardSelect = (index) => {
    if (index === currentIndex) {
      setIsFlipped(!isFlipped);
      return;
    }
    setIsFlipped(false);
    setSlideDirection(index > currentIndex ? "left" : "right");
    setTimeout(() => {
      setCurrentIndex(index);
      handleSetSearchParams("cardNo", (index + 1).toString());
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

  if (review.length === 0) {
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

  const currentFlashcard = filteredReview[currentIndex];
  const progressPercentage =
    filteredReview.length > 0
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
                Go through the Flashcards and learn them one by one.
              </p>
            </div>
          </div>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchReset={handleSearchReset}
        />
        <Flashcard
          currentFlashcard={currentFlashcard}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          getSlideClass={getSlideClass}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          currentIndex={
            currentFlashcard
              ? review.findIndex(
                  (card) => card.question === currentFlashcard.question
                )
              : 0
          }
          totalCards={review.length}
        />

        {!!filteredReview.length && (
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
