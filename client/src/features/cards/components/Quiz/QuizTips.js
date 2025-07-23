import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

const QuizTips = ({ className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-700/50 overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 rounded-lg">
            <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Quiz Taking Tips
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                  📖
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Read carefully
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Take your time to understand each question
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  🤔
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Think first
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Consider your answer before looking at options
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  ❌
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Eliminate wrong answers
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Rule out obviously incorrect options first
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  🎯
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Trust your instinct
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your first answer is often correct
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTips;
