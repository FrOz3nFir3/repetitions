import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon } from "@heroicons/react/24/solid";

const StudiedCardGridItem = ({ card }) => {
  return (
    <Link to={`/card/${card._id}/review`} className="block">
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col overflow-hidden cursor-pointer">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-600/5 rounded-full blur-2xl transition-all duration-300 group-hover:from-green-500/10 group-hover:to-emerald-600/10"></div>

        <div className="relative z-10 p-6 flex-grow">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm">
              <svg
                className="h-3 w-3 text-white"
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
            <div className="flex flex-col">
              <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                Category
              </span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {card.category}
              </span>
            </div>
          </div>

          {/* Main Topic */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                <svg
                  className="h-3 w-3 text-blue-600 dark:text-blue-400"
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
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Main Topic
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
              {card["main-topic"]}
            </h3>
          </div>

          {/* Sub Topic */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                <svg
                  className="h-3 w-3 text-purple-600 dark:text-purple-400"
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
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                Sub Topic
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2">
              {card["sub-topic"]}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                In Progress
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400 group-hover:gap-2 transition-all duration-300">
              Continue
              <svg
                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/5 group-hover:to-emerald-600/5 rounded-2xl transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default StudiedCardGridItem;
