import React, { useState } from "react";
import AddQuizModal from "./AddQuizModal";
import QuizItem from "./QuizItem";
import {
  LightBulbIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const QuizList = ({ quizzes = [], cardId, flashcardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <div className="p-2 mr-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            Associated Quizzes ({quizzes.length})
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            These quizzes test the knowledge from the flashcard.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          Add Quiz
        </button>
      </div>

      {quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz, index) => (
            <QuizItem
              index={index}
              key={quiz._id || index}
              quiz={quiz}
              cardId={cardId}
              flashcardId={flashcardId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
            No quizzes yet.
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Click "Add Quiz" to create the first one for this flashcard.
          </p>
        </div>
      )}

      {isModalOpen && (
        <AddQuizModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cardId={cardId}
          flashcardId={flashcardId}
        />
      )}
    </div>
  );
};

export default QuizList;
