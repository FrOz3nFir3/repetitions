import React from "react";
import { FireIcon, ChartBarIcon, TrophyIcon } from "@heroicons/react/24/solid";

const FocusQuizHeader = ({ current, total, focusQuizzesCount, score }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;
  const accuracyPercentage = current > 0 ? (score / current) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
              <FireIcon className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
              !
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-orange-600 dark:from-white dark:via-red-200 dark:to-orange-300 bg-clip-text text-transparent">
              Focus Quiz
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Mastering your most challenging questions ({focusQuizzesCount}{" "}
              questions)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl">
              <ChartBarIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {current} / {total}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>

          {/* Score Indicator */}
          <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl">
              <TrophyIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {score} / {current}
              </span>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {current > 0 ? Math.round(accuracyPercentage) : 0}% Accuracy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Bar with Focus Theme */}
      <div className="relative">
        <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-red-500 via-orange-600 to-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Start</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};

export default FocusQuizHeader;
