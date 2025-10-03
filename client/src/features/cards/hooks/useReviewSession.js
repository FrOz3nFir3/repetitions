import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useGetCardReviewProgressQuery,
  useUpdateUserReviewProgressMutation,
} from "../../../api/apiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useSearchParams, useLocation } from "react-router-dom";
import { useWeakCards } from "./useWeakCards";

export const useReviewSession = (initialCards, card_id) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [slideDirection, setSlideDirection] = useState("");
  const [showConfidenceRating, setShowConfidenceRating] = useState(false);
  const [reviewCards, setReviewCards] = useState([]);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);
  const user = useSelector(selectCurrentUser);

  // Skip flag to prevent unnecessary GET calls after PATCH updates
  const [skipGetCall, setSkipGetCall] = useState(false);

  const { data: cardProgress } = useGetCardReviewProgressQuery(card_id, {
    skip: !card_id || !user || skipGetCall,
  });
  const [updateReviewProgress] = useUpdateUserReviewProgressMutation();
  const { updateWeakCardBasedOnRating } = useWeakCards();

  // Refs to track progress updates and prevent duplicate calls
  const lastSavedProgress = useRef(0);
  const progressUpdateTimeout = useRef(null);
  const hasCompletedSession = useRef(false);
  const isInitialSetupComplete = useRef(false);

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  const sessionCards = useMemo(() => {
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
  }, [initialCards, reviewCards]);

  const currentFlashcard = sessionCards[currentIndex];

  const handleSetSearchParams = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (value) {
            newParams.set(key, value);
          } else {
            newParams.delete(key);
          }
          return newParams;
        },
        { replace: true }
      ); // Use replace instead of push
    },
    [setSearchParams]
  );

  // Handle initial setup from cardProgress
  useEffect(() => {
    if (!user || !cardProgress || !card_id || isInitialSetupComplete.current) {
      return;
    }

    const lastReviewedCardNo = cardProgress.lastReviewedCardNo;

    if (lastReviewedCardNo && lastReviewedCardNo > 0) {
      // If user completed the entire deck, start from beginning
      if (lastReviewedCardNo >= initialCards.length) {
        setCurrentIndex(0);
        lastSavedProgress.current = 0;
      } else {
        // Otherwise, resume from where they left off
        const newIndex = lastReviewedCardNo - 1;
        setCurrentIndex(newIndex);
        lastSavedProgress.current = lastReviewedCardNo;
      }
    } else {
      // No previous progress, start from beginning
      setCurrentIndex(0);
      lastSavedProgress.current = 0;
    }

    // Mark initial setup as complete
    isInitialSetupComplete.current = true;
  }, [cardProgress, card_id, initialCards.length, user]);

  // Sync URL with currentIndex (after initial setup is complete)
  useEffect(() => {
    if (!isInitialSetupComplete.current) {
      return;
    }

    const cardNo = currentIndex + 1;
    handleSetSearchParams("cardNo", cardNo.toString());
  }, [currentIndex]);

  // Debounced progress update function - stabilized dependencies
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
          setSkipGetCall(true); // Skip GET call after this update
          // Check if on focus review page at time of execution
          const currentlyOnFocusReview =
            window.location.pathname.includes("/focus-review");
          updateReviewProgress({
            card_id: cardId,
            lastReviewedCardNo: cardNo,
            skipFocusReviewInvalidation: currentlyOnFocusReview,
          });
          lastSavedProgress.current = cardNo;
        }
      }, 4000); // 4 second debounce
    },
    [updateReviewProgress, user] // Removed isOnFocusReviewPage dependency
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
      setSkipGetCall(true); // Skip GET call after this update
      // Check if on focus review page at time of execution
      const currentlyOnFocusReview =
        window.location.pathname.includes("/focus-review");
      updateReviewProgress({
        card_id,
        lastReviewedCardNo: originalCardsCount,
        skipFocusReviewInvalidation: currentlyOnFocusReview,
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

  // Debounced progress tracking on index change - only after user interaction
  useEffect(() => {
    // Skip if initial setup is not complete or user hasn't interacted
    if (!isInitialSetupComplete.current || !userHasInteracted || !user) {
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
    userHasInteracted,
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (progressUpdateTimeout.current) {
        clearTimeout(progressUpdateTimeout.current);
      }
    };
  }, []);

  // Handle URL cardNo changes (but only after initial setup is complete)
  useEffect(() => {
    if (typeof cardNoQuery === "undefined" || Number.isNaN(cardNoQuery)) {
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

      // Mark that user has interacted
      setUserHasInteracted(true);

      // Mark as started if navigating from first card and haven't started yet
      if (currentIndex === 0 && card_id && lastSavedProgress.current === 0) {
        lastSavedProgress.current = 1; // Update immediately to prevent race conditions
        debouncedProgressUpdate(card_id, 1);
      }

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
        const nextCard = sessionCards[newIndex];

        if (nextCard && !nextCard.isReview && nextCard.urlCardNo) {
          handleSetSearchParams("cardNo", nextCard.urlCardNo.toString());
        }
        setSlideDirection(direction === "next" ? "in-right" : "in-left");
      }, 150);
    },
    [
      currentIndex,
      sessionCards,
      card_id,
      debouncedProgressUpdate,
      handleSetSearchParams,
    ]
  );

  const handleNext = useCallback(
    (justAddedReviewCard = false) => navigate("next", justAddedReviewCard),
    [navigate]
  );
  const handlePrev = useCallback(() => navigate("prev"), [navigate]);

  const handleCardSelect = useCallback(
    (index) => {
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
      const selectedCard = sessionCards[index];
      if (selectedCard && !selectedCard.isReview && selectedCard.urlCardNo) {
        handleSetSearchParams("cardNo", selectedCard.urlCardNo.toString());
      }
    },
    [currentIndex, isFlipped, sessionCards, handleSetSearchParams]
  );

  const handleFlipCard = useCallback(() => {
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
        setUserHasInteracted(true);
        debouncedProgressUpdate(card_id, 1);
      }
    }
  }, [isFlipped, user, currentIndex, card_id, debouncedProgressUpdate]);

  const handleConfidenceRating = async (rating) => {
    const willAddReviewCard = rating === "partial" || rating === "struggling";
    setShowConfidenceRating(false);

    if (user) {
      // For logged-in users: Make immediate API call to save weak cards (no delays!)
      if (card_id && currentFlashcard?._id) {
        try {
          await updateWeakCardBasedOnRating(
            card_id,
            currentFlashcard._id,
            rating
          );
        } catch (error) {
          // Continue with the review flow even if weak cards update fails
        }
      }
      // Track completed cards for UI purposes
      setCompletedCards((prev) => new Set(prev).add(currentFlashcard.question));
    } else {
      // For non-logged-in users: Add to local review cards for immediate review experience
      if (willAddReviewCard) {
        setReviewCards((prev) => [...prev, currentFlashcard]);
      } else {
        setCompletedCards((prev) =>
          new Set(prev).add(currentFlashcard.question)
        );
      }
    }

    // Navigate appropriately based on whether we added a review card
    setTimeout(() => handleNext(!user && willAddReviewCard), 300);
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
    setUserHasInteracted(false);

    // Clear any pending updates
    if (progressUpdateTimeout.current) {
      clearTimeout(progressUpdateTimeout.current);
    }

    if (card_id && user) {
      setSkipGetCall(true); // Skip GET call after this update
      // Check if on focus review page at time of execution
      const currentlyOnFocusReview =
        window.location.pathname.includes("/focus-review");
      updateReviewProgress({
        card_id,
        lastReviewedCardNo: 0,
        skipFocusReviewInvalidation: currentlyOnFocusReview,
      });
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
