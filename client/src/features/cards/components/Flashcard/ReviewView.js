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
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import SearchBar from "./Review/SearchBar";
import Flashcard from "./Review/Flashcard";
import Navigation from "./Review/Navigation";
import CardGallery from "./Review/CardGallery";
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
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          No Flashcards to Review
        </h3>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-300">
          Add some flashcards to get started.
        </p>
      </div>
    );
  }

  const currentFlashcard = filteredReview[currentIndex];
  const progressPercentage =
    filteredReview.length > 0
      ? ((currentIndex + 1) / filteredReview.length) * 100
      : 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-2xl overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Review Session
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-300">
          Click the card to flip it and reveal the answer.
        </p>
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
      />

      {!!filteredReview.length && (
        <>
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm hidden md:flex items-center justify-center">
            <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
            Use Left/Right arrow keys to navigate
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm md:hidden flex items-center justify-center">
            <InformationCircleIcon className="h-5 w-5 mr-2" />
            Swipe left or right to navigate on mobile / tablet
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
    </div>
  );
}

export default Review;
