import React from "react";
import QuizDetail from "./QuizDetail";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

const QuizList = ({
  quiz,
  onEdit,
  onDelete,
  originalQuizIndex,
  currentIndex,
}) => {
  if (!quiz) {
    return (
      <div className="text-center py-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            No quiz found
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md">
            Try a different search term, or create a new quiz to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <QuizDetail
        quiz={quiz}
        onEdit={onEdit}
        onDelete={onDelete}
        originalQuizIndex={originalQuizIndex}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export default QuizList;
