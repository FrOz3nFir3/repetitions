import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetCardReviewProgressQuery,
  useUpdateUserReviewProgressMutation,
} from "../../../api/apiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";

export const useReviewSession = (
  initialCards,
  filteredCards,
  searchTerm,
  card_id
) => {
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
  const user = useSelector(selectCurrentUser);

  const { data: cardProgress } = useGetCardReviewProgressQuery(card_id, {
    skip: !card_id || !user,
  });
  const [updateReviewProgress] = useUpdateUserReviewProgressMutation();

  // Refs to track progress updates and prevent duplicate calls
  const lastSavedProgress = useRef(0);
  const progressUpdateTimeout = useRef(null);
  const hasCompletedSession = useRef(false);
  const isInitialSetupComplete = useRef(false);
  const userHasInteracted = useRef(false);
  const currentProgressRef = useRef(0);

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  const searchQuery = useMemo(() => searchParams.get("search"), [searchParams]);

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
    if (!user || searchQuery) return;
    // Only run initial setup once when we first get cardProgress
    if (cardProgress && card_id && !isInitialSetupComplete.current) {
      const lastReviewedCardNo = cardProgress.lastReviewedCardNo;

      if (lastReviewedCardNo && lastReviewedCardNo > 0) {
        // If user completed the entire deck, start from beginning
        if (lastReviewedCardNo >= initialCards.length) {
          setCurrentIndex(0);
          handleSetSearchParams("cardNo", "1");
          lastSavedProgress.current = 0; // Reset to 0 so they can "start" again
        } else {
          // Otherwise, resume from where they left off
          const newIndex = lastReviewedCardNo - 1;

          setCurrentIndex(newIndex);
          handleSetSearchParams("cardNo", lastReviewedCardNo.toString());
          lastSavedProgress.current = lastReviewedCardNo;
        }
      }

      // Mark initial setup as complete after this effect runs
      isInitialSetupComplete.current = true;
    }
  }, [cardProgress, card_id, initialCards.length, user]);

  // Debounced progress update function
  const debouncedProgressUpdate = useCallback(
    (cardId, cardNo) => {
      if (!cardId || cardNo === lastSavedProgress.current || !user) return;

      // Clear existing timeout
      if (progressUpdateTimeout.current) {
        clearTimeout(progressUpdateTimeout.current);
      }

      // Set new timeout for debounced update
      progressUpdateTimeout.current = setTimeout(() => {
        // Double-check the progress hasn't been saved already and user is still logged in
        if (cardNo !== lastSavedProgress.current && user) {
          updateReviewProgress({
            card_id: cardId,
            lastReviewedCardNo: cardNo,
          });
          lastSavedProgress.current = cardNo;
        }
      }, 2000); // 2 second debounce
    },
    [updateReviewProgress, user]
  );

  // Handle completion - only call once
  useEffect(() => {
    if (showCompletion && card_id && user && !hasCompletedSession.current) {
      hasCompletedSession.current = true;
      // Clear any pending debounced updates
      if (progressUpdateTimeout.current) {
        clearTimeout(progressUpdateTimeout.current);
      }

      // Calculate the actual number of original cards (not including review cards)
      const originalCardsCount = initialCards.length;
      updateReviewProgress({
        card_id,
        lastReviewedCardNo: originalCardsCount,
      });
      lastSavedProgress.current = originalCardsCount;
    }
  }, [
    showCompletion,
    card_id,
    user,
    updateReviewProgress,
    initialCards.length,
  ]);

  // Update current progress ref whenever index changes
  useEffect(() => {
    const currentCard = sessionCards[currentIndex];
    if (!currentCard?.isReview && currentIndex < initialCards.length) {
      currentProgressRef.current = currentIndex + 1;
    }
  }, [currentIndex, sessionCards, initialCards.length]);

  // Debounced progress tracking on index change - only after user interaction
  useEffect(() => {
    // Skip if initial setup is not complete or user hasn't interacted
    if (
      !isInitialSetupComplete.current ||
      !userHasInteracted.current ||
      !user
    ) {
      return;
    }

    // Skip API calls when navigating to review cards (they have isReview: true)
    const currentCard = sessionCards[currentIndex];
    if (currentCard?.isReview) {
      return;
    }

    if (card_id && !showCompletion && !hasCompletedSession.current) {
      debouncedProgressUpdate(card_id, currentIndex + 1);
    }
  }, [
    currentIndex,
    card_id,
    showCompletion,
    debouncedProgressUpdate,
    sessionCards,
    user,
  ]);

  // Cleanup effect - only save if we haven't completed and haven't saved recently
  useEffect(() => {
    return () => {
      if (progressUpdateTimeout.current) {
        clearTimeout(progressUpdateTimeout.current);
      }

      // Only save on unmount if:
      // 1. We have a card_id
      // 2. Session wasn't completed
      // 3. User has actually interacted (to avoid saving on initial mount/unmount)
      // 4. The progress is actually different from what was last saved
      // 5. The current position is valid (> 0)

      const progressToSave = currentProgressRef.current;

      if (
        card_id &&
        user &&
        !hasCompletedSession.current &&
        userHasInteracted.current &&
        progressToSave !== lastSavedProgress.current &&
        progressToSave > 0
      ) {
        updateReviewProgress({
          card_id,
          lastReviewedCardNo: progressToSave,
        });
      }
    };
  }, []); // Empty dependency array - only run on unmount

  useEffect(() => {
    if (typeof cardNoQuery === "undefined" || Number.isNaN(cardNoQuery)) return;

    const targetIndex = cardNoQuery - 1;
    if (targetIndex >= 0 && targetIndex < initialCards.length) {
      setCurrentIndex(targetIndex);
    } else {
      setCurrentIndex(0);
      // handleSetSearchParams("cardNo", "1");
    }
  }, [cardNoQuery, initialCards.length]);

  const navigate = useCallback(
    (direction, justAddedReviewCard = false) => {
      if (sessionCards.length === 0) return;

      // Mark that user has interacted
      userHasInteracted.current = true;

      // Mark as started if navigating from first card and haven't started yet
      if (currentIndex === 0 && card_id && lastSavedProgress.current === 0) {
        lastSavedProgress.current = 1; // Update immediately to prevent race conditions
        debouncedProgressUpdate(card_id, 1);
      }

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
          : // biome-ignore lint/style/noUselessElse: <explanation>
            sessionCards.length;
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

    // Mark that user has interacted
    userHasInteracted.current = true;

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
    if (!isFlipped) {
      setShowConfidenceRating(true);
      // Mark user as having started the review when they flip the first card
      if (
        user &&
        currentIndex === 0 &&
        card_id &&
        (lastSavedProgress.current === 0 || lastSavedProgress.current === 1)
      ) {
        userHasInteracted.current = true;
        debouncedProgressUpdate(card_id, 1);
      }
    }
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

    // Reset tracking refs
    hasCompletedSession.current = false;
    lastSavedProgress.current = 0;
    isInitialSetupComplete.current = false;
    userHasInteracted.current = false;
    currentProgressRef.current = 1;

    // Clear any pending updates
    if (progressUpdateTimeout.current) {
      clearTimeout(progressUpdateTimeout.current);
    }

    if (card_id && user) {
      updateReviewProgress({ card_id, lastReviewedCardNo: 0 });
      lastSavedProgress.current = 0;
    }
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
