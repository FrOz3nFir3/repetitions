import React, { useState } from "react";
import AddQuizModal from "./AddQuizModal";
import QuizItem from "./QuizItem";
import { PlusIcon } from "@heroicons/react/24/outline";

const QuizList = ({ quizzes = [], cardId, flashcardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold text-gray-700 dark:text-white">
          Quizzes ({quizzes.length})
        </h4>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer inline-flex items-center gap-x-2 bg-purple-600 hover:bg-purple-700 px-3 py-2 text-sm rounded-md font-semibold text-white shadow-sm"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" />
          Add Quiz
        </button>
      </div>
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <QuizItem
            index={index}
            key={quiz.quizId}
            quiz={quiz}
            cardId={cardId}
            flashcardId={flashcardId}
          />
        ))}
      </div>
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
