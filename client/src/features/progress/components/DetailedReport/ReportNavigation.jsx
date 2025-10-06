import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import NavigationDropdown from "../../../cards/components/EditCard/NavigationDropdown";
import { getTextFromHtml } from "../../../../utils/dom";

const ReportNavigation = ({
  onPrev,
  onNext,
  onQuestionSelect,
  currentIndex,
  totalQuestions,
  report,
}) => {
  const getQuestionLabel = (question, index) => {
    return `Question ${index + 1}`;
  };

  const getQuestionDescription = (question) => {
    if (!question?.question) return "";
    const plainText = getTextFromHtml(question.question);
    return plainText;
  };

  return (
    <div className="sticky top-0 z-[100] bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 border-b border-white/20 dark:border-gray-700/20">
      <div className="px-3 sm:px-6 py-3">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/40 dark:border-gray-700/40 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Navigation Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="cursor-pointer group relative p-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                    Previous
                  </span>
                </div>
              </button>

              <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {currentIndex + 1} of {totalQuestions}
                </span>
              </div>

              <button
                onClick={onNext}
                disabled={currentIndex === totalQuestions - 1}
                className="cursor-pointer group relative p-2 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <ChevronRightIcon className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg shadow-lg">
                    Next
                  </span>
                </div>
              </button>
            </div>

            {/* Right: Go to Question Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Go to:
              </span>
              <NavigationDropdown
                items={report}
                currentIndex={currentIndex}
                onItemSelect={onQuestionSelect}
                placeholder="Select question..."
                getItemLabel={getQuestionLabel}
                getItemDescription={getQuestionDescription}
                type="quiz"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNavigation;
