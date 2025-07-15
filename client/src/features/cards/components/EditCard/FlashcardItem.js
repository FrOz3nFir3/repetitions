import React, { useState } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { CardField } from "../CardField";
import {
  TrashIcon,
  CheckCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import QuizList from "./QuizList";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

const FlashcardItem = ({ flashcard, cardId }) => {
  const [updateCard, { error, isSuccess }] = usePatchUpdateCardMutation();
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
      <div className="overflow-hidden">
        <div>
          {error && (
            <div className="rounded-md bg-red-100 p-4 mb-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
              <strong>Error:</strong>{" "}
              {error.data?.error || "An unexpected error occurred."}
            </div>
          )}
          {isSuccess && (
            <div className="rounded-md bg-green-100 p-4 mb-4 text-sm text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircleIcon className="h-5 w-5 inline mr-2" />
              Flashcard updated successfully!
            </div>
          )}

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <DocumentIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Flashcard Details
              </h3>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-500 transition-colors"
              aria-label="Delete flashcard"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Question Section */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Front View
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 my-2">
              This is the "front" of the card that the user will see first.
            </p>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CardField
                _id={cardId}
                text="question"
                value={flashcard.question}
                cardId={flashcard._id}
              />
            </div>
          </div>

          {/* Answer Section */}
          <div className="mb-6">
            <label className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Back View
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 my-2">
              This is the "back" of the card, revealed as the answer.
            </p>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <CardField
                _id={cardId}
                text="answer"
                value={flashcard.answer}
                cardId={flashcard._id}
              />
            </div>
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <QuizList
            quizzes={flashcard.quizzes}
            cardId={cardId}
            flashcardId={flashcard._id}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFlashcard}
        title="Confirm Deletion"
        description="Are you sure you want to permanently delete this flashcard and all of its associated quizzes? This action cannot be undone."
      />
    </>
  );
};

export default FlashcardItem;
