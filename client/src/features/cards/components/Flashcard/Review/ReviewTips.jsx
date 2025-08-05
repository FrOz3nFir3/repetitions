import React from "react";
import { BookOpenIcon } from "@heroicons/react/24/outline";

const ReviewTips = ({ className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10 rounded-2xl border border-blue-200 dark:border-blue-700/50 overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Review Best Practices
          </h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-green-600 dark:text-green-400">
                  🧠
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Think before flipping
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Try to recall the answer first
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  🔄
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Review regularly
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Spaced repetition improves retention
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                  ⏱️
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Take your time
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Quality over speed for better learning
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  🎯
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Focus on weak areas
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Spend more time on difficult cards
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  💡
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Make connections
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Link new info to what you know
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                  📊
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Track progress
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Monitor your learning journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTips;
