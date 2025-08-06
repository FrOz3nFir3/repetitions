import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const ReportNavigation = ({
  onPrev,
  onNext,
  onQuestionSelect,
  currentIndex,
  totalQuestions,
  report,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-[100] bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 border-b border-white/20 dark:border-gray-700/20">
      <div className="px-3 sm:px-6 py-3">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/40 dark:border-gray-700/40 shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`disabled:cursor-not-allowed cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                currentIndex === 0
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-white">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-xs sm:text-sm font-medium"
                >
                  Go to Question
                  <ChevronDownIcon
                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="absolute top-10 sm:top-12 left-0 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[200] max-h-64 overflow-y-auto">
                    <div className="py-2">
                      {report.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onQuestionSelect(index);
                            setIsOpen(false);
                          }}
                          className={`cursor  -pointer block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                            currentIndex === index
                              ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          Question {index + 1}
                          {currentIndex === index && (
                            <CheckCircleIcon className="inline h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onNext}
              disabled={currentIndex === totalQuestions - 1}
              className={`disabled:cursor-not-allowed cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                currentIndex === totalQuestions - 1
                  ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
              }`}
            >
              <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportNavigation;
