import React, { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import EditQuizModal from "./EditQuizModal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

const QuizItem = ({ index, quiz, cardId, flashcardId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [updateCard] = usePatchUpdateCardMutation();
  const expandedRef = React.useRef(null);

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

  useEffect(() => {
    if (isExpanded && expandedRef.current) {
      expandedRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [isExpanded]);

  const hasOptions = quiz.options && quiz.options.length > 0;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
        <div
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              Quiz {index + 1}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
                setIsExpanded(true);
              }}
              className="cursor-pointer p-2 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50"
              aria-label="Edit quiz"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="cursor-pointer p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50"
              aria-label="Delete quiz"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              className="cursor-pointer p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Expand quiz details"
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div ref={expandedRef}>
          {isExpanded && (
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Quiz Question
                </p>
                <HtmlRenderer htmlContent={quiz.quizQuestion} />
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Correct Answer
                </p>
                <div className="p-3 rounded-md bg-green-100 ">
                  <HtmlRenderer htmlContent={quiz.quizAnswer} />
                </div>
              </div>

              {hasOptions && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Incorrect Options ({quiz.options.length})
                  </p>
                  <ul className="space-y-2">
                    {quiz.options.map((option, i) => (
                      <li
                        key={i}
                        className="p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <HtmlRenderer htmlContent={option.value} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <EditQuizModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          cardId={cardId}
          flashcardId={flashcardId}
          quiz={quiz}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Quiz"
        description="Are you sure you want to permanently delete this quiz? This action cannot be undone."
      />
    </>
  );
};

export default QuizItem;
