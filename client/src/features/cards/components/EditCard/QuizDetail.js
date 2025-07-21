import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Quiz from "./Quiz";
import EmptyState from "../../../../components/ui/EmptyState";

const QuizDetail = ({ quiz, onEdit, onDelete, originalQuizIndex }) => {
  if (!quiz) {
    return (
      <EmptyState
        message="No Quiz Selected"
        details="Please select a quiz from the list to view its details."
      />
    );
  }

  return (
    <div className="mt-4 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-700">
      {/* Header */}
      <div className="flex flex-wrap gap-2  justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2">
          Quiz Question {originalQuizIndex}
        </h3>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={() => onEdit(quiz)}
            className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete(quiz)}
            className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="space-y-4">
        <Quiz quiz={quiz} />
      </div>
    </div>
  );
};

export default QuizDetail;
