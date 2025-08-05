import React from "react";
import { CardField } from "../CardField";
import AddNewOption from "./AddNewOption";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const QuizOptionsManager = ({ quiz, cardId, flashcardId }) => {
  return (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        Quiz Options
      </h4>
      <div className="space-y-4">
        {/* Minimum Options now sits above the options list */}
        <div>
          <CardField
            _id={cardId}
            text="minimumOptions"
            value={quiz.minimumOptions}
            cardId={flashcardId}
            quizId={quiz.quizId}
          />
        </div>

        {/* Options List */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-500 dark:text-gray-300 text-sm">
            Options
          </p>
          {/* Display the correct answer as a read-only option */}
          <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/50 p-2 rounded-md border border-green-200 dark:border-green-800 pointer-events-none">
            <div className="flex-grow min-w-0 text-green-800 dark:text-green-300">
              <HtmlRenderer htmlContent={quiz.quizAnswer} />
            </div>
          </div>
          {quiz.options.map((option, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded-md border dark:border-gray-600"
            >
              <div className="flex-grow min-w-0">
                <CardField
                  _id={cardId}
                  text="option"
                  value={option}
                  cardId={flashcardId}
                  quizId={quiz.quizId}
                  optionIndex={i}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Option Form */}
        {quiz.options.length < quiz.minimumOptions - 1 && (
          <AddNewOption
            cardId={cardId}
            flashcardId={flashcardId}
            quiz={quiz}
          />
        )}
      </div>
    </div>
  );
};

export default QuizOptionsManager;
