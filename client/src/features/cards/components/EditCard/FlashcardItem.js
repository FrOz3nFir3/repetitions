import React from "react";
import { useDispatch } from "react-redux";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { modifyCard } from "../../state/cardSlice";
import { CardField } from "../CardField";
import QuizOptionsManager from "./QuizOptionsManager";
import { TrashIcon } from "@heroicons/react/24/outline";

const FlashcardItem = ({ flashcard, cardId }) => {
  const [updateCard, { error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();

  const handleDeleteFlashcard = () => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcard.cardId,
      deleteCard: true,
    };
    updateCard(updateDetails).then((response) => {
      if (response.data) {
        dispatch(modifyCard(updateDetails));
      }
    });
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.data.error}
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className="w-full">
          <CardField
            _id={cardId}
            text="question"
            value={flashcard.question}
            cardId={flashcard.cardId}
          />
          <div className="mt-2 border-t pt-2 dark:border-gray-700">
            <CardField
              _id={cardId}
              text="answer"
              value={flashcard.answer}
              cardId={flashcard.cardId}
            />
          </div>
        </div>
        <button
          onClick={handleDeleteFlashcard}
          className="cursor-pointer ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>

      <QuizOptionsManager flashcard={flashcard} cardId={cardId} />
    </div>
  );
};

export default FlashcardItem;
