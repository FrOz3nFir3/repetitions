import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";
import EmptyState from "../../../../components/ui/EmptyState";

const QuizList = ({
  quizzes,
  handleQuizSelect,
  handleEdit,
  handleDelete,
  searchTerm,
}) => {
  if (!quizzes || quizzes?.length === 0) {
    return (
      <EmptyState
        message={searchTerm ? "No Results Found" : "No Quizzes Available"}
        details={
          searchTerm
            ? "No quizzes match your search criteria."
            : "This card does not have any quizzes yet."
        }
      />
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {quizzes.map((quiz, index) => (
        <div
          key={quiz._id}
          className="group bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-shadow duration-200"
        >
          <div
            className="flex-grow cursor-pointer"
            onClick={() => handleQuizSelect(index)}
          >
            <p className="font-semibold text-gray-900 dark:text-white">
              <HtmlRenderer htmlContent={quiz.quizQuestion} />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {quiz.options.length} options
            </p>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(quiz);
              }}
              className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Edit quiz"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(quiz);
              }}
              className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Delete quiz"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
