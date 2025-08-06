import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useReviewSession = (initialCards, filteredCards, searchTerm) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [showConfidenceRating, setShowConfidenceRating] = useState(false);
  const [reviewCards, setReviewCards] = useState([]);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  const sessionCards = useMemo(() => {
    if (searchTerm) {
      return filteredCards.map((card) => ({
        ...card,
        originalIndex: initialCards.findIndex(
          (c) => c.question === card.question
        ),
        urlCardNo:
          initialCards.findIndex((c) => c.question === card.question) + 1,
      }));
    }

    const cardsWithOriginalIndex = initialCards.map((card, index) => ({
      ...card,
      originalIndex: index,
      urlCardNo: index + 1,
    }));

    const reviewCardsWithMeta = reviewCards.map((card) => ({
      ...card,
      isReview: true,
      originalIndex: initialCards.findIndex(
        (c) => c.question === card.question
      ),
    }));

    return [...cardsWithOriginalIndex, ...reviewCardsWithMeta];
  }, [initialCards, filteredCards, searchTerm, reviewCards]);

  const currentFlashcard = sessionCards[currentIndex];

  const handleSetSearchParams = (key, value) => {
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      return prev;
    });
  };

  useEffect(() => {
    if (Number.isNaN(cardNoQuery)) {
      setCurrentIndex(0);
      handleSetSearchParams("cardNo", "1");
      return;
    }
    const targetIndex = cardNoQuery - 1;
    if (targetIndex >= 0 && targetIndex < initialCards.length) {
      setCurrentIndex(targetIndex);
    } else {
      setCurrentIndex(0);
      handleSetSearchParams("cardNo", "1");
    }
  }, [cardNoQuery, initialCards.length]);

  const navigate = useCallback(
    (direction, justAddedReviewCard = false) => {
      if (sessionCards.length === 0) return;

      const isLastCard = currentIndex === sessionCards.length - 1;
      if (
        direction === "next" &&
        isLastCard &&
        !searchTerm &&
        !justAddedReviewCard
      ) {
        setShowCompletion(true);
        return;
      }

      setIsFlipped(false);
      setShowConfidenceRating(false);
      setSlideDirection(direction === "next" ? "left" : "right");

      setTimeout(() => {
        const effectiveLength = justAddedReviewCard
          ? sessionCards.length + 1
          : sessionCards.length;
        const newIndex =
          direction === "next"
            ? (currentIndex + 1) % effectiveLength
            : (currentIndex - 1 + effectiveLength) % effectiveLength;

        setCurrentIndex(newIndex);
        const nextCard = sessionCards[newIndex];

        if (nextCard && !nextCard.isReview && nextCard.urlCardNo) {
          handleSetSearchParams("cardNo", nextCard.urlCardNo.toString());
        }
        setSlideDirection(direction === "next" ? "in-right" : "in-left");
      }, 150);
    },
    [currentIndex, sessionCards, searchTerm]
  );

  const handleNext = (justAddedReviewCard = false) =>
    navigate("next", justAddedReviewCard);
  const handlePrev = () => navigate("prev");

  const handleCardSelect = (index) => {
    if (index === currentIndex) {
      setIsFlipped(!isFlipped);
      if (!isFlipped) setShowConfidenceRating(true);
      return;
    }
    setIsFlipped(false);
    setShowConfidenceRating(false);
    setCurrentIndex(index);
    const selectedCard = sessionCards[index];
    if (selectedCard && !selectedCard.isReview && selectedCard.urlCardNo) {
      handleSetSearchParams("cardNo", selectedCard.urlCardNo.toString());
    }
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) setShowConfidenceRating(true);
  };

  const handleConfidenceRating = (rating) => {
    const willAddReviewCard = rating === "partial" || rating === "struggling";
    setShowConfidenceRating(false);
    if (willAddReviewCard) {
      setReviewCards((prev) => [...prev, currentFlashcard]);
    } else {
      setCompletedCards((prev) => new Set(prev).add(currentFlashcard.question));
    }
    setTimeout(() => handleNext(willAddReviewCard), 300);
  };

  const restartReview = () => {
    setShowCompletion(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSlideDirection("");
    setShowConfidenceRating(false);
    setReviewCards([]);
    setCompletedCards(new Set());
    handleSetSearchParams("cardNo", "1");
  };

  return {
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
    touchStartX,
    isSwiping,
  };
};
