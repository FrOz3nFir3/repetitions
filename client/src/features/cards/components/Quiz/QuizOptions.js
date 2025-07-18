import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const OptionButton = ({ option, answer, selectedAnswer, onSelect }) => {
  const isSelected = selectedAnswer?.option === option;
  const isCorrectAnswer = answer === option;

  let baseClasses =
    "cursor-pointer w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50";

  let stateClasses = "";

  if (selectedAnswer) {
    if (isCorrectAnswer) {
      stateClasses = `bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-white ${
        isSelected ? "ring-4 ring-green-300 dark:ring-green-600" : ""
      }`;
    } else if (isSelected) {
      stateClasses =
        "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-white ring-4 ring-red-300 dark:ring-red-600";
    } else {
      stateClasses =
        "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed opacity-50";
    }
  } else {
    stateClasses =
      "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:-translate-y-1 focus:ring-blue-300 dark:focus:ring-blue-500";
  }

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={!!selectedAnswer}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow font-semibold max-w-full">
          <HtmlRenderer htmlContent={option} />
        </div>
        {selectedAnswer && (
          <div className="flex-shrink-0 h-6 w-6 ml-4">
            {isCorrectAnswer ? (
              <CheckCircleIcon className="text-green-500" />
            ) : isSelected ? (
              <XCircleIcon className="text-red-500" />
            ) : null}
          </div>
        )}
      </div>
    </button>
  );
};

const QuizOptions = ({ options, answer, selectedAnswer, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option, index) => (
        <OptionButton
          key={index}
          option={option}
          answer={answer}
          selectedAnswer={selectedAnswer}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default QuizOptions;
