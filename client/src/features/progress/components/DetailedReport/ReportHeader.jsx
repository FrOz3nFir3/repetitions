import React from "react";
import { ChartBarIcon, XMarkIcon } from "@heroicons/react/24/solid";

const ReportHeader = ({ cardData, onClose }) => {
  if (!cardData) return null;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 rounded-t-2xl sm:rounded-t-3xl">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
                Quiz Performance Report
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Review your quiz progress and detailed answers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-white transition-all duration-200 backdrop-blur-sm flex-shrink-0"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 dark:border-gray-700/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Category */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm flex-shrink-0">
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Category
                </span>
                <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 truncate">
                  {cardData.category}
                </span>
              </div>
            </div>

            {/* Main Topic */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Main Topic
                </span>
                <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 truncate">
                  {cardData["main-topic"]}
                </span>
              </div>
            </div>

            {/* Sub Topic */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  Sub Topic
                </span>
                <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 truncate">
                  {cardData["sub-topic"]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
