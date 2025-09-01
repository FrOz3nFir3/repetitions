import React from "react";
import { FireIcon } from "@heroicons/react/24/solid";

const FocusReviewHeader = ({
  showCompletion = false,
  focusCardsCount = 0,
  currentIndex,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
            <FireIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-amber-600 dark:from-white dark:via-orange-200 dark:to-amber-300 bg-clip-text text-transparent">
              Focus Review
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              {showCompletion
                ? "Targeted practice session completed"
                : `Practicing ${focusCardsCount} challenging ${
                    focusCardsCount === 1 ? "card" : "cards"
                  }`}
            </p>
          </div>
        </div>
      </div>

      {!showCompletion && currentIndex === 0 && (
        <div className="mb-6 text-center inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-red-200/50 dark:border-red-500/30">
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
            <strong>Focus Mode:</strong> You're reviewing cards that need extra
            practice. Rate them honestly to improve your learning!
          </p>
        </div>
      )}
    </div>
  );
};

export default FocusReviewHeader;
