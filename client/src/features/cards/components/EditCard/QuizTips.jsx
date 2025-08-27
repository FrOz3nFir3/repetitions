import React from "react";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

const QuizTips = ({ className = "" }) => {
  return (
    <div
      className={`mt-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-indigo-900/10 rounded-2xl border border-purple-200 dark:border-purple-700/50 overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-700 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
            Quiz Best Practices
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                  ✓
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Clear questions
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Make questions unambiguous and direct
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  📊
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Balanced options
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Make all choices plausible but distinct
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  🎯
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  One correct answer
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Ensure only one option is clearly correct
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  ⚡
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Test understanding
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Focus on comprehension, not memorization
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
