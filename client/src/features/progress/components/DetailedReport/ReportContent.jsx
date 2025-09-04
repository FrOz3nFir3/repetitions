import React from "react";
import {
  QuestionMarkCircleIcon,
  LightBulbIcon,
  CheckCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const ReportContent = ({
  currentQuestion,
  shuffledOptions,
  slideClassName,
  currentIndex,
}) => {
  if (!currentQuestion) return null;

  return (
    <div className="px-3 sm:px-6 pb-6 overflow-x-hidden">
      <div className={slideClassName}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 dark:border-gray-700/30">
          {/* Question Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                <QuestionMarkCircleIcon className="h-5 w-5  text-white" />
              </div>
              <div>
                <h3 className="text-lg  font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
                  Question {currentIndex + 1}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Review the question and correct answer
                </p>
              </div>
            </div>

            {/* Question Content */}
            <HtmlRenderer
              className="!mt-0 text-base  text-gray-900 dark:text-white"
              htmlContent={currentQuestion.question}
            />
          </div>

          {/* Answer Options */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                <LightBulbIcon className="h-6 w-6  text-white" />
              </div>
              <div>
                <h3 className="text-base  font-bold text-gray-900 dark:text-white">
                  Answer Options
                </h3>
                <p className="text-xs  text-gray-600 dark:text-gray-400">
                  The correct answer is highlighted
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4">
              {shuffledOptions.map((option, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-default ${
                    option === currentQuestion.answer
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 shadow-2xl"
                      : "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {option === currentQuestion.answer && (
                    <div className="absolute inset-0">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                    </div>
                  )}

                  <div className="relative z-10 p-4 flex items-center">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg mr-3 sm:mr-4 ${
                        option === currentQuestion.answer
                          ? "bg-white/20 text-white border-2 border-white/30"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <HtmlRenderer
                        className={`!mt-0 text-sm leading-relaxed ${
                          option === currentQuestion.answer
                            ? "text-white"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                        htmlContent={option}
                      />
                    </div>
                    {option === currentQuestion.answer && (
                      <div className="flex-shrink-0 ml-3 sm:ml-4">
                        <CheckCircleIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hint Text */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
              <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm font-medium">
                Performance stats are shown above
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
