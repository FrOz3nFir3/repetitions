import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import {
  useUpdateUserWeakCardsMutation,
  apiSlice,
} from "../../../api/apiSlice";

export const useWeakCards = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useDispatch();
  const [updateWeakCards] = useUpdateUserWeakCardsMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if we're currently on focus review page
  const isOnFocusReviewPage = location.pathname.includes("/focus-review");
  const isOnRegularReviewPage =
    location.pathname.includes("/review") && !isOnFocusReviewPage;

  // Manual cache invalidation function for focus review data
  const invalidateFocusReviewCacheManually = useCallback(
    (cardId) => {
      // Only invalidate when NOT on focus review page to prevent immediate refetches
      if (!isOnFocusReviewPage && cardId) {
        dispatch(
          apiSlice.util.invalidateTags([
            { type: "FocusReviewData", id: cardId },
          ])
        );
      }
    },
    [dispatch, isOnFocusReviewPage]
  );

  const addWeakCard = useCallback(
    async (cardId, flashcardId, rating = "partial") => {
      if (!user || !cardId || !flashcardId) {
        return false;
      }

      setIsUpdating(true);
      try {
        const result = await updateWeakCards({
          cardId,
          flashcardId,
          rating,
          action: "add",
          skipFocusReviewInvalidation: isOnFocusReviewPage, // Skip if on focus review page
          skipRegularReviewInvalidation: isOnRegularReviewPage, // Skip if on regular review page
        }).unwrap();
        return true;
      } catch (error) {
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, updateWeakCards]
  );

  const removeWeakCard = useCallback(
    async (cardId, flashcardId, rating = "mastered") => {
      if (!user || !cardId || !flashcardId) {
        return false;
      }

      setIsUpdating(true);
      try {
        const result = await updateWeakCards({
          cardId,
          flashcardId,
          rating,
          action: "remove",
          // Always skip focus review invalidation during active focus review sessions
          // We'll handle cache invalidation manually when needed
          skipFocusReviewInvalidation: isOnFocusReviewPage,
          skipRegularReviewInvalidation: isOnRegularReviewPage, // Skip if on regular review page
        }).unwrap();
        return true;
      } catch (error) {
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, updateWeakCards, isOnFocusReviewPage, isOnRegularReviewPage]
  );

  const updateWeakCardBasedOnRating = useCallback(
    async (cardId, flashcardId, rating) => {
      if (!user || !cardId || !flashcardId || !rating) {
        return false;
      }

      // Determine action based on confidence rating
      const shouldAddToWeakCards =
        rating === "partial" || rating === "struggling";
      const shouldRemoveFromWeakCards = rating === "mastered";

      if (shouldAddToWeakCards) {
        return await addWeakCard(cardId, flashcardId, rating);
      } else if (shouldRemoveFromWeakCards) {
        return await removeWeakCard(cardId, flashcardId, rating);
      }
      // For other ratings (like "good"), don't modify weak cards
      return true;
    },
    [addWeakCard, removeWeakCard, user]
  );

  return {
    addWeakCard,
    removeWeakCard,
    updateWeakCardBasedOnRating,
    invalidateFocusReviewCacheManually,
    isUpdating,
    isAuthenticated: !!user,
  };
};
