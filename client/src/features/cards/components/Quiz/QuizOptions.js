import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const OptionButton = ({ option, answer, selectedAnswer, onSelect }) => {
  const isSelected = selectedAnswer?.option === option;
  const isCorrect = answer === option;

  let buttonClass =
    "dark:text-white cursor-pointer w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ";

  if (isSelected) {
    buttonClass += selectedAnswer.isCorrect
      ? "bg-green-100 border-green-500 ring-4 ring-green-200 dark:!text-black"
      : "bg-red-100 border-red-500 ring-4 ring-red-200 dark:!text-black";
  } else if (selectedAnswer && isCorrect) {
    // Show the correct answer if a wrong one was chosen
    buttonClass += "bg-green-100 border-green-500 dark:!text-black";
  } else {
    // Default state
    buttonClass +=
      "bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600";
  }

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={!!selectedAnswer}
      className={buttonClass}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-lg ">{option}</span>
        {isSelected &&
          (isCorrect ? (
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-red-500" />
          ))}
      </div>
    </button>
  );
};

const QuizOptions = ({ options, answer, selectedAnswer, onSelect }) => {
  return (
    <div className="space-y-3">
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
