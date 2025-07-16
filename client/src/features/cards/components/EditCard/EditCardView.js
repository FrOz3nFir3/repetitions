import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectCurrentCard } from "../../state/cardSlice";
import FlashcardList from "./FlashcardList";
import EditCardHeader from "./EditCardHeader";
import FlashcardControls from "./FlashcardControls";
import FlashcardNavigation from "./FlashcardNavigation";

const EditCardView = () => {
  const card = useSelector(selectCurrentCard);
  const { _id, review = [] } = card || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [jumpToIndex, setJumpToIndex] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");

  const filteredFlashcards = useMemo(() => {
    if (!review) return [];
    return review.filter(
      (flashcard) =>
        flashcard.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [review, searchTerm]);
  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  useEffect(() => {
    const cardNo = cardNoQuery;
    const outOfBounds = cardNo > filteredFlashcards.length || cardNo <= 0;
    // delete cardNo if no flashcards match the search

    if (filteredFlashcards.length === 0) {
      handleSetSearchParams("cardNo", "");
      return;
    }
    if (Number.isNaN(cardNo)) {
      handleSetSearchParams("cardNo", "1");
      return;
    }
    if (outOfBounds) {
      const validIndex =
        (cardNo - 1 + filteredFlashcards.length) % filteredFlashcards.length;
      handleSetSearchParams("cardNo", (validIndex + 1).toString());
      return;
    }

    handleIndexChange(cardNo - 1);
  }, [cardNoQuery, filteredFlashcards.length]);

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

  const handleIndexChange = (newIndex, direction) => {
    if (newIndex >= 0 && newIndex < filteredFlashcards.length) {
      setAnimationDirection(direction);
      setCurrentIndex(newIndex);
      handleSetSearchParams("cardNo", (newIndex + 1).toString());
    }
  };

  const handleNext = () => {
    handleIndexChange((currentIndex + 1) % filteredFlashcards.length, "left");
  };

  const handlePrev = () => {
    handleIndexChange(
      (currentIndex - 1 + filteredFlashcards.length) %
        filteredFlashcards.length,
      "right"
    );
  };

  const handleJump = (e) => {
    e.preventDefault();
    const index = parseInt(jumpToIndex, 10) - 1;
    if (!isNaN(index)) {
      handleIndexChange(index, index > currentIndex ? "left" : "right");
      setJumpToIndex("");
    }
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSetSearchParams("search", newSearchTerm);
    handleIndexChange(0, "right");
  };

  const handleReset = () => {
    setSearchTerm("");
    handleSetSearchParams("search", "");
    handleIndexChange(0, "right");
  };

  const currentFlashcard = filteredFlashcards[currentIndex];

  if (!card) {
    return null; // Or a loading state
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <EditCardHeader totalFlashcards={review.length} flashcardId={_id} />
      <FlashcardControls
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {filteredFlashcards.length > 0 && (
        <FlashcardNavigation
          onPrev={handlePrev}
          onNext={handleNext}
          onJump={handleJump}
          currentIndex={currentIndex}
          totalCount={filteredFlashcards.length}
          jumpToIndex={jumpToIndex}
          onJumpInputChange={(e) => setJumpToIndex(e.target.value)}
          disabled={filteredFlashcards.length <= 1}
        />
      )}

      <div className="relative overflow-hidden">
        <FlashcardList
          flashcard={currentFlashcard}
          cardId={_id}
          direction={animationDirection}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default EditCardView;
