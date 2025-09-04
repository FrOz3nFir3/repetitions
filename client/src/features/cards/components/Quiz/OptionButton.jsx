import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const OptionButton = ({ option, answer, selectedAnswer, onSelect, index }) => {
  const isSelected = selectedAnswer?.option === option;
  const isCorrectAnswer = answer === option;
  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  let baseClasses =
    "cursor-pointer w-full text-left p-4 rounded-2xl border-2  focus:outline-none focus:ring-4 focus:ring-opacity-50 group";

  let stateClasses = "";

  if (selectedAnswer) {
    if (isCorrectAnswer) {
      stateClasses = `bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-400 dark:border-green-500 text-green-800 dark:text-green-200 shadow-lg ${
        isSelected ? "ring-4 ring-green-300 dark:ring-green-600 scale-101" : ""
      }`;
    } else if (isSelected) {
      stateClasses =
        "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200 ring-4 ring-red-300 dark:ring-red-600 scale-101 shadow-lg";
    } else {
      stateClasses =
        "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50";
    }
  } else {
    stateClasses =
      "bg-white/90 dark:bg-gray-800/90 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl hover:bg-purple-50/50 dark:hover:bg-purple-900/20 focus:ring-purple-300 dark:focus:ring-purple-500 text-gray-900 dark:text-white transition-all duration-200";
  }

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={!!selectedAnswer}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className="flex items-center gap-4">
        {/* Option Label */}
        <div
          className={`flex-shrink-0 w-5 sm:w-8 h-5 sm:h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
            selectedAnswer
              ? isCorrectAnswer
                ? "bg-green-500 text-white"
                : isSelected
                ? "bg-red-500 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
              : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50"
          }`}
        >
          {optionLabels[index] || index + 1}
        </div>

        {/* Option Content */}
        <div className="w-0  flex-grow">
          <HtmlRenderer className="max-w-full  !mt-0" htmlContent={option} />
        </div>

        {/* Result Icon */}
        {selectedAnswer && (
          <div className="flex-shrink-0 h-6 w-6">
            {isCorrectAnswer ? (
              <CheckCircleIcon className="text-green-500 animate-pulse" />
            ) : isSelected ? (
              <XCircleIcon className="text-red-500 animate-pulse" />
            ) : null}
          </div>
        )}
      </div>
    </button>
  );
};

export default OptionButton;
