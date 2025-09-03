import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { getTextFromHtml } from "../../../../utils/dom";

const FocusQuizGallery = ({
  quizzes,
  currentQuestion,
  handleQuizSelect,
  currentQuestionIndex,
  selectedAnswer,
}) => {
  if (!quizzes || quizzes.length <= 1) return null;

  return (
    <div className="mt-8">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Focus Quiz Gallery
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Navigate through questions - go back to re-attempt or skip ahead
          through the quiz
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-64 overflow-y-auto p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl">
        {quizzes.map((quiz, index) => {
          const isCurrentQuestion = currentQuestion?._id === quiz._id;
          const questionNumber = index + 1;

          // Determine status based on completion state
          let statusIcon = null;
          let statusColor = "bg-gray-200 dark:bg-gray-700";

          if (isCurrentQuestion && selectedAnswer) {
            if (selectedAnswer.isCorrect) {
              statusIcon = (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              );
              statusColor =
                "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-500";
            } else {
              statusIcon = <XCircleIcon className="h-4 w-4 text-red-500" />;
              statusColor =
                "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-500";
            }
          } else if (isCurrentQuestion) {
            statusIcon = (
              <FireIcon className="h-4 w-4 text-orange-500 animate-pulse" />
            );
            statusColor =
              "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-500";
          }
          const plainText = getTextFromHtml(quiz.quizQuestion);

          return (
            <button
              key={quiz._id}
              onClick={() => handleQuizSelect(index)}
              className={`
                cursor-pointer relative p-3 rounded-xl transition-all duration-200 border-2
                ${
                  isCurrentQuestion
                    ? `${statusColor} transform scale-105 shadow-lg`
                    : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-105"
                }
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
              `}
              title={`Question ${questionNumber}: ${plainText?.substring(
                0,
                50
              )}...`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`
                  text-sm font-medium
                  ${
                    isCurrentQuestion
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }
                `}
                >
                  Q{questionNumber}
                </span>
                {statusIcon}
              </div>

              {/* Question preview */}
              <div className="mt-2 text-left">
                <p
                  className={`
                  text-xs line-clamp-3
                  ${
                    isCurrentQuestion
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-500 dark:text-gray-400"
                  }
                `}
                >
                  {plainText || "Question content"}
                </p>
              </div>

              {/* Difficulty indicator */}
              <div className="absolute top-1 right-1">
                <div
                  className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                  title="Struggling question"
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FocusQuizGallery;
