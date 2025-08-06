import React from "react";
import {
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ChartPieIcon,
} from "@heroicons/react/24/solid";

const ReportStats = ({ currentQuestion }) => {
  if (!currentQuestion) return null;

  const accuracy =
    currentQuestion.attempts > 0
      ? `${Math.round(
          (currentQuestion.timesCorrect / currentQuestion.attempts) * 100
        )}%`
      : "N/A";

  return (
    <div className="px-3 sm:px-6 py-4">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Question Performance
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center border border-blue-200/50 dark:border-blue-700/50">
            <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {currentQuestion.attempts}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Attempts</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 text-center border border-green-200/50 dark:border-green-700/50">
            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {currentQuestion.timesCorrect}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Correct</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-3 text-center border border-red-200/50 dark:border-red-700/50">
            <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {currentQuestion.timesIncorrect || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Incorrect
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-3 text-center border border-indigo-200/50 dark:border-indigo-700/50">
            <ChartPieIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {accuracy}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStats;
