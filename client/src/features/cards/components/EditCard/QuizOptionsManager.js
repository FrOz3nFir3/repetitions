import React from "react";
import { CardField } from "../CardField";
import AddNewOption from "./AddNewOption";

const QuizOptionsManager = ({ flashcard, cardId }) => {
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
            value={flashcard.minimumOptions}
            cardId={flashcard.cardId}
          />
        </div>

        {/* Options List */}
        <div className="space-y-2">
          <p className="font-semibold text-gray-500 dark:text-gray-300 text-sm">
            Options
          </p>
          {flashcard.options.map((option, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded-md border dark:border-gray-600"
            >
              <div className="flex-grow min-w-0">
                <CardField
                  _id={cardId}
                  text="option"
                  value={option}
                  cardId={flashcard.cardId}
                  optionIndex={i}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add New Option Form */}
        {flashcard.options.length < flashcard.minimumOptions && (
          <AddNewOption cardId={cardId} flashcard={flashcard} />
        )}
      </div>
    </div>
  );
};

export default QuizOptionsManager;
