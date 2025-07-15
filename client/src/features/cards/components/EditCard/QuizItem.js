import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditQuizModal from "./EditQuizModal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

const QuizItem = ({ index, quiz, cardId, flashcardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateCard] = usePatchUpdateCardMutation();

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcardId,
      quizId: quiz._id,
      deleteQuiz: true,
    };
    updateCard(updateDetails);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="flex justify-between items-start">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              Quiz {index + 1}
            </p>
            <div className="mt-2 space-y-2 overflow-hidden">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                  Question
                </p>
                <HtmlRenderer htmlContent={quiz.quizQuestion} />
              </div>
              <div className="border-t pt-2 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                  Answer
                </p>
                <HtmlRenderer htmlContent={quiz.quizAnswer} />
              </div>
              <div className="border-t pt-2 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  {quiz.options.length + 1} Options
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={handleEdit}
              className="cursor-pointer text-blue-500 hover:text-blue-700"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="cursor-pointer text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isModalOpen && (
          <EditQuizModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            cardId={cardId}
            flashcardId={flashcardId}
            quiz={quiz}
          />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        description="Are you sure you want to delete this quiz? This action cannot be undone."
      />
    </>
  );
};

export default QuizItem;
