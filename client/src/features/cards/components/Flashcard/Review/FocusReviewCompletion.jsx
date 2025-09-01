import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../../../../api/apiSlice";
import {
  FireIcon,
  SparklesIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const FocusReviewCompletion = ({
  completedCardsCount,
  totalFocusCards = 0,
  allWeakCardsMastered = false,
  perfectCards = new Set(),
  totalWeakCards = 0,
  restartFocusReview,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleStartNormalReview = () => {
    navigate(`/card/${id}/review`);
  };

  const handleRetryFocusReview = () => {
    // Invalidate focus review cache to refetch latest data
    dispatch(
      apiSlice.util.invalidateTags([
        { type: "FocusReviewData", id: id },
        { type: "FocusReviewData", id: "LIST" },
      ])
    );

    // Reset the focus review state
    if (restartFocusReview) {
      restartFocusReview();
    }
  };

  // Calculate perfect score count from Set
  const perfectScore = perfectCards.size;
  
  // Determine if user mastered all their weak cards during this session
  const masteredAllCards =
    allWeakCardsMastered || completedCardsCount === totalFocusCards;

  // Detect low completion scenarios:
  // 1. User studied fewer cards than total available weak cards
  // 2. User got fewer perfect scores than total weak cards available
  const hasLowCompletion = totalWeakCards > 0 && (
    completedCardsCount < totalWeakCards || 
    perfectScore < totalWeakCards
  );

  // Show retry button when there are remaining cards to practice
  const showRetryButton = hasLowCompletion && restartFocusReview;

  return (
    <div className="flex justify-center mb-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-200/50 dark:border-orange-700/50 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            {masteredAllCards ? (
              <CheckBadgeIcon className="h-16 w-16 text-green-500 animate-bounce" />
            ) : (
              <FireIcon className="h-16 w-16 text-orange-500 animate-bounce" />
            )}
            <SparklesIcon className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {masteredAllCards ? "🎉 Outstanding!" : hasLowCompletion ? "📚 Good Progress!" : "🔥 Focus Session Complete!"}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {masteredAllCards ? (
            <>
              Incredible work! You've mastered all your challenging cards in
              this focused practice session.
              {completedCardsCount > 0 && (
                <span className="block mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  ✨ {completedCardsCount} cards mastered and removed from your
                  focus list!
                </span>
              )}
            </>
          ) : hasLowCompletion ? (
            <>
              You've made progress on your challenging cards! 
              {perfectScore > 0 && (
                <span className="block mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                  ✨ {perfectScore} cards mastered perfectly!
                </span>
              )}
              {totalWeakCards > completedCardsCount && (
                <span className="block mt-1 text-sm text-orange-600 dark:text-orange-400">
                  📚 {totalWeakCards - completedCardsCount} more cards available to practice
                </span>
              )}
            </>
          ) : (
            <>
              Great work on your targeted practice session! You've made solid
              progress on your challenging cards.
              {completedCardsCount > 0 && (
                <span className="block mt-1 text-sm">
                  You worked through {completedCardsCount} challenging cards
                </span>
              )}
            </>
          )}
        </p>

        <div className="space-y-3">
          {showRetryButton && (
            <button
              onClick={handleRetryFocusReview}
              className="cursor-pointer w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FireIcon className="animate-pulse h-5 w-5" />
              Review Again
            </button>
          )}
          
          <button
            onClick={handleStartNormalReview}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {masteredAllCards
              ? "Continue with Regular Review"
              : "Switch to Regular Review"}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {masteredAllCards
            ? "🌟 Excellent progress! Keep up the regular practice to maintain your mastery."
            : hasLowCompletion
            ? "💪 Keep reviewing to master all your challenging cards! Every practice session counts."
            : "💡 Keep practicing regularly to master all your challenging cards!"}
        </p>
      </div>
    </div>
  );
};

export default FocusReviewCompletion;
