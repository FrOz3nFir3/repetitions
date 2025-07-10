import React from "react";
import { useDispatch } from "react-redux";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { modifyCard } from "../../state/cardSlice";
import { CardField } from "../CardField";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const QuizOptionsManager = ({ flashcard, cardId }) => {
  const [updateCard] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();
  const newOptionRef = React.useRef();

  const handleAddOption = (e) => {
    e.preventDefault();
    const option = newOptionRef.current.value;
    if (!option) return;

    const updateDetails = { _id: cardId, cardId: flashcard.cardId, option };
    updateCard(updateDetails).then((res) => {
      if (res.data) {
        dispatch(modifyCard(updateDetails));
        newOptionRef.current.value = "";
      }
    });
  };

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
        Quiz Options
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardField
          _id={cardId}
          text="minimumOptions"
          value={flashcard.minimumOptions}
          cardId={flashcard.cardId}
        />
        <div className="space-y-2">
          {flashcard.options.map((option, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white dark:bg-gray-700 p-2 rounded-md border dark:border-gray-600"
            >
              <div className="flex-grow">
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
          {flashcard.options.length < flashcard.minimumOptions && (
            <form
              onSubmit={handleAddOption}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                ref={newOptionRef}
                placeholder="Add new option"
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="cursor-pointer p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
              >
                <PlusCircleIcon className="h-6 w-6" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizOptionsManager;
