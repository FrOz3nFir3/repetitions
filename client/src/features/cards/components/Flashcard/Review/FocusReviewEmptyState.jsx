import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";

const FocusReviewEmptyState = ({
  hasReviewData = false,
  onRefreshFocusReview,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleStartNormalReview = () => {
    navigate(`/card/${id}/review`);
  };

  const handleFocusReviewAgain = () => {
    if (onRefreshFocusReview) {
      onRefreshFocusReview();
    } else {
      // Fallback to page reload if no refresh function provided
      window.location.reload();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50/30 to-teal-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center py-16 px-8">
        <div className="relative inline-block mb-6">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>
          <SparklesIcon className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-600 dark:from-white dark:via-green-200 dark:to-emerald-300 bg-clip-text text-transparent mb-4">
          🎉 Excellent Work!
        </h3>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          You don't have any weak cards to review right now. You're mastering
          your flashcards!
        </p>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-sm mx-auto mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            💡 Keep up the great work by continuing with regular practice to
            maintain your progress.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleStartNormalReview}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue Regular Review
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Focus review will be available again when you encounter challenging
          cards during your studies.
        </p>
      </div>
    </div>
  );
};

export default FocusReviewEmptyState;
