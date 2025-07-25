import React from "react";
import { AcademicCapIcon, ChartBarIcon } from "@heroicons/react/24/solid";

const QuizHeader = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <AcademicCapIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
              Quiz Time!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Test your knowledge by taking this quiz!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
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
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
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

export default QuizHeader;
