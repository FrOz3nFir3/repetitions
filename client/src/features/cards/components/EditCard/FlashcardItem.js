import React, { useState } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { CardField } from "../CardField";
import { TrashIcon } from "@heroicons/react/24/outline";
import QuizList from "./QuizList";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

const FlashcardItem = ({ flashcard, cardId }) => {
  const [updateCard, { error }] = usePatchUpdateCardMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteFlashcard = () => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcard._id,
      deleteCard: true,
    };
    updateCard(updateDetails);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
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
              cardId={flashcard._id}
            />
            <div className="mt-2 border-t pt-2 dark:border-gray-700">
              <CardField
                _id={cardId}
                text="answer"
                value={flashcard.answer}
                cardId={flashcard._id}
              />
            </div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="cursor-pointer ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
          >
            <TrashIcon className="h-6 w-6" />
          </button>
        </div>

        <QuizList
          quizzes={flashcard.quizzes}
          cardId={cardId}
          flashcardId={flashcard._id}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFlashcard}
        title="Delete Flashcard"
        description="Are you sure you want to delete this flashcard? This will also delete all associated quizzes. This action cannot be undone."
      />
    </>
  );
};

export default FlashcardItem;
