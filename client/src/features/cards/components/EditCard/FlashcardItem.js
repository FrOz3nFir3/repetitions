import React, { useState, useEffect } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { CardField } from "../CardField";
import {
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  SparklesIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import FlashcardTips from "./FlashcardTips";

const FlashcardItem = ({ flashcard, cardId, currentIndex, originalIndex }) => {
  const [updateCard, { error, isSuccess }] = usePatchUpdateCardMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const errorRef = React.useRef(null);

  const handleDeleteFlashcard = () => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcard._id,
      deleteCard: true,
    };
    updateCard(updateDetails);
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  return (
    <>
      <div className="py-1 overflow-hidden">
        {/* Status Messages */}
        <div ref={errorRef} className="space-y-4">
          {error && (
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5"></div>
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-red-700 dark:text-red-300 leading-relaxed">
                      {error.data?.error ||
                        "An unexpected error occurred. Please try again."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSuccess && (
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">
                      Changes saved successfully!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 leading-relaxed">
                      Your flashcard has been updated and is ready for studying.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">
                Flashcard #{originalIndex || currentIndex + 1}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="group cursor-pointer relative p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            aria-label="Delete flashcard"
          >
            <TrashIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
            <div className="absolute -bottom-6 left-0 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="whitespace-nowrap z-99 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-lg border border-red-200 dark:border-red-700">
                Delete Card
              </span>
            </div>
          </button>
        </div>

        {/* Card Content - Single Column Layout */}
        <div className="mt-4 space-y-8">
          {/* Question Section */}
          <div className="group space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ">
                  Front Side
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  What you want to learn or remember
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-blue-600 dark:border-blue-700 shadow-lg hover:shadow-xl ">
              <CardField
                _id={cardId}
                text="question"
                value={flashcard.question}
                cardId={flashcard._id}
                showFlashcardPreview={true}
                flashcardData={flashcard}
              />
            </div>
          </div>

          {/* Answer Section */}
          <div className="group space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <LightBulbIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <label className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Back Side
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The answer or explanation
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-emerald-500 dark:border-emerald-600 shadow-lg hover:shadow-xl ">
              <CardField
                _id={cardId}
                text="answer"
                value={flashcard.answer}
                cardId={flashcard._id}
                showFlashcardPreview={true}
                flashcardData={flashcard}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Tips Section */}
        <FlashcardTips className="mt-8" />
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteFlashcard}
        title="Delete Flashcard"
        description="Are you sure you want to permanently delete this flashcard? This action cannot be undone and will remove all associated quiz data."
      />
    </>
  );
};

export default FlashcardItem;
