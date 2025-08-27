import React from "react";
import { Link } from "react-router-dom";
import { AcademicCapIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const CardGridItem = ({ card, showCategory = false }) => {
  return (
    <Link to={`/card/${card._id}`} className="block">
      <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col overflow-hidden cursor-pointer">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-full blur-2xl transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-indigo-600/10"></div>

        <div className="relative z-10 p-6 flex-grow">
          {/* Category Badge */}
          {card.category && showCategory && (
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
                <span className="text-sm font-semibold text-green-700 dark:text-green-300 break-word line-clamp-4">
                  {card.category}
                </span>
              </div>
            </div>
          )}

          {/* Main Topic */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                <svg
                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white  break-word line-clamp-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {card["main-topic"]}
            </h3>
          </div>

          {/* Sub Topic */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                <svg
                  className="h-4 w-4 text-purple-600 dark:text-purple-400"
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
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 break-word line-clamp-4">
              {card["sub-topic"]}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex gap-2 flex-wrap justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 ">
                <BookOpenIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {card.reviewLength || 0} Flashcard
                  {(card.reviewLength || 0) > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {card.quizzesLength || 0} Quiz
                  {(card.quizzesLength || 0) > 1 ? "zes" : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all duration-300">
              Explore
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
      </div>
    </Link>
  );
};

export default CardGridItem;
