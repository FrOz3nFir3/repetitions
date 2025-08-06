import React from "react";
import { TrophyIcon, SparklesIcon } from "@heroicons/react/24/solid";

const ReviewCompletion = ({ onRestart, completedCardsCount }) => {
  return (
    <div className="flex justify-center mb-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-green-200/50 dark:border-green-700/50 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <TrophyIcon className="h-16 w-16 text-yellow-500 animate-bounce" />
            <SparklesIcon className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          🎉 Great Job!
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You've completed this review session!
          {completedCardsCount > 0 && (
            <span className="block mt-1 text-sm">
              You mastered {completedCardsCount} cards
            </span>
          )}
        </p>

        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Review Again
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            💡 Try Quiz Mode below for a different challenge!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompletion;
