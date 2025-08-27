import React from "react";
import {
  PencilIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import { AcademicCapIcon } from "@heroicons/react/24/solid";

import QuizItem from "./QuizItem";
import QuizTips from "./QuizTips";

const QuizDetail = ({
  quiz,
  onEdit,
  onDelete,
  originalQuizIndex,
  currentIndex,
}) => {
  if (!quiz) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl inline-block mb-4">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          No Quiz Selected
        </h3>
        <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md mx-auto">
          Please select a quiz from the list to view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="py-1 overflow-hidden">
      {/* Quiz Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <AcademicCapIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
            Quiz #{originalQuizIndex || currentIndex + 1}
          </h2>
        </div>

        <div className="flex justify-end items-center gap-2 flex-wrap">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(quiz)}
            className="relative group cursor-pointer flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            aria-label="Edit Quiz"
          >
            <PencilIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Edit</span>
            <div className="absolute -bottom-6 left-0 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="whitespace-nowrap z-99 text-xs font-medium text-pink-600 dark:text-pink-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700">
                Edit quiz
              </span>
            </div>
          </button>
          <button
            onClick={() => onDelete(quiz)}
            className="group cursor-pointer relative p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            aria-label="Delete quiz"
          >
            <TrashIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200" />
            <div className="absolute -bottom-6 left-0 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="whitespace-nowrap z-99 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-lg border border-red-200 dark:border-red-700">
                Delete Quiz
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      <QuizItem quiz={quiz} />

      {/* Enhanced Tips Section */}
      <QuizTips className="mt-8" />
    </div>
  );
};

export default QuizDetail;
