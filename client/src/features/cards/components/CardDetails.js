import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  BookOpenIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const CardDetails = (data) => {
  const {
    _id,
    ["main-topic"]: mainTopic,
    ["sub-topic"]: subTopic,
    category,
    review,
    reviewLength = 0,
    showCategory,
    showContinue,
    scrollToTop = true,
  } = data;

  const handleClick = () => {
    if (scrollToTop) {
      // Small delay to ensure navigation happens first
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const flashcardCount = review?.length || reviewLength;

  return (
    <Link to={`/card/${_id}`} onClick={handleClick} className="block group">
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:bg-white dark:hover:bg-gray-800 h-full flex flex-col overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-full blur-2xl transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-indigo-600/10"></div>

        <div className="relative z-10 flex-grow">
          {showCategory && (
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">
                {category}
              </span>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {mainTopic}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 font-medium line-clamp-2 text-sm">
              {subTopic}
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {flashcardCount} item{flashcardCount !== 1 ? "s" : ""}
              </span>
            </div>

            {showContinue ? (
              <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all duration-300">
                Continue
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:gap-2 transition-all duration-300">
                Explore
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 rounded-2xl transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default CardDetails;
