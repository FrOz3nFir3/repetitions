import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useWeakCards } from "./useWeakCards";

export const useFocusSession = (initialCards, card_id, weakCards = [], onCardMastered) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [showConfidenceRating, setShowConfidenceRating] = useState(false);
  const [reviewCards, setReviewCards] = useState([]);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [perfectCards, setPerfectCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);
  const user = useSelector(selectCurrentUser);
  const { updateWeakCardBasedOnRating } = useWeakCards();

  // Reset state when weak cards change (e.g., when navigating back from regular review)
  useEffect(() => {
    setShowCompletion(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSlideDirection("");
    setShowConfidenceRating(false);
    setReviewCards([]);
    setCompletedCards(new Set());
    setPerfectCards(new Set());
    setUserHasInteracted(false);
  }, [weakCards, card_id]);

  // Filter initial cards to only include weak cards
  const focusCards = useMemo(() => {
    if (!weakCards || weakCards.length === 0) {
      return [];
    }

    // Check if weakCards already contain the full flashcard data (new API structure)
    const hasFullData = weakCards.length > 0 && weakCards[0].question;

    if (hasFullData) {
      // New API structure: weakCards already contain question and answer
      return weakCards.map((weakCard) => ({
        _id: weakCard._id || weakCard.flashcardId,
        question: weakCard.question,
        answer: weakCard.answer,
        addedAt: weakCard.addedAt,
        reviewCount: weakCard.reviewCount,
      }));
    } else {
      // Legacy structure: filter initialCards based on weakCard IDs
      const weakCardIds = new Set(
        weakCards.map((weakCard) => weakCard.flashcardId?.toString())
      );
      return initialCards.filter((card) =>
        weakCardIds.has(card._id?.toString())
      );
    }
  }, [initialCards, weakCards]);

  // Session cards include focus cards plus any review cards added during the session
  const sessionCards = useMemo(() => {
    const cardsWithOriginalIndex = focusCards.map((card, index) => ({
      ...card,
      originalIndex: index,
    }));

    const reviewCardsWithMeta = reviewCards.map((card) => ({
      ...card,
      isReview: true,
      originalIndex: focusCards.findIndex((c) => c.question === card.question),
    }));

    return [...cardsWithOriginalIndex, ...reviewCardsWithMeta];
  }, [focusCards, reviewCards]);

  const currentFlashcard = sessionCards[currentIndex];

  // Check if we have no weak cards to show
  const hasNoWeakCards = focusCards.length === 0;

  // Show completion only when we have no weak cards, not when cards are mastered locally
  useEffect(() => {
    if (hasNoWeakCards && !showCompletion) {
      setShowCompletion(true);
    }
  }, [hasNoWeakCards, showCompletion]);

  const navigate = useCallback(
    (direction, justAddedReviewCard = false) => {
      if (sessionCards.length === 0) return;

      // Mark that user has interacted
      setUserHasInteracted(true);

      const isLastCard = currentIndex === sessionCards.length - 1;

      if (direction === "next" && isLastCard && !justAddedReviewCard) {
        setShowCompletion(true);
        return;
      }

      setIsFlipped(false);
      setShowConfidenceRating(false);
      setSlideDirection(direction === "next" ? "left" : "right");

      setTimeout(() => {
        let newIndex;
        if (direction === "next") {
          newIndex = currentIndex + 1;
          // If we're at the end and not adding a review card, show completion
          if (newIndex >= sessionCards.length && !justAddedReviewCard) {
            setShowCompletion(true);
            return;
          }
        } else {
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = sessionCards.length - 1;
          }
        }

        setCurrentIndex(newIndex);
        setSlideDirection(direction === "next" ? "in-right" : "in-left");
      }, 150);
    },
    [currentIndex, sessionCards]
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

    // Mark that user has interacted
    setUserHasInteracted(true);

    setIsFlipped(false);
    setShowConfidenceRating(false);
    setCurrentIndex(index);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowConfidenceRating(true);
      setUserHasInteracted(true);
    }
  };

  const handleConfidenceRating = async (rating) => {
    const willAddReviewCard = rating === "partial" || rating === "struggling";
    const willRemoveFromWeakCards = rating === "mastered";
    setShowConfidenceRating(false);

    // Update weak cards based on confidence rating
    // On focus review page: only call API for mastered/perfect (removal) ratings
    // Don't call API for partial/struggling as those cards are already in weakCards
    if (user && card_id && currentFlashcard?._id && !willAddReviewCard) {
      try {
        await updateWeakCardBasedOnRating(
          card_id,
          currentFlashcard._id,
          rating
        );

        // Track cards that were mastered for cache invalidation on navigation
        if (willRemoveFromWeakCards && onCardMastered) {
          onCardMastered();
        }
      } catch (error) {
        // Continue with the review flow even if weak cards update fails
      }
    }

    if (willAddReviewCard) {
      setReviewCards((prev) => [...prev, currentFlashcard]);
    } else {
      // Only track as completed, don't remove from focus cards until page refresh
      setCompletedCards((prev) => new Set(prev).add(currentFlashcard.question));
      
      // Track cards marked as mastered/perfect in a separate Set
      if (willRemoveFromWeakCards && currentFlashcard?._id) {
        setPerfectCards((prev) => new Set(prev).add(currentFlashcard._id));
      }
    }
  setTimeout(() => handleNext(willAddReviewCard), 300);
  };

  const restartFocusReview = useCallback(() => {
    // Reset all state to initial values
    setShowCompletion(false);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSlideDirection("");
    setShowConfidenceRating(false);
    setReviewCards([]);
    setCompletedCards(new Set());
    setPerfectCards(new Set());
    setUserHasInteracted(false);
  }, []);

  return {
    currentIndex,
    currentFlashcard,
    isFlipped,
    slideDirection,
    showConfidenceRating,
    showCompletion,
    completedCards,
    perfectCards,
    sessionCards,
    focusCards,
    hasNoWeakCards,
    handleNext,
    handlePrev,
    handleCardSelect,
    handleFlipCard,
    handleConfidenceRating,
    restartFocusReview,
    touchStartX,
    isSwiping,
  };
};
