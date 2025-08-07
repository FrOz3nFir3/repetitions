import React from "react";
import { BookOpenIcon } from "@heroicons/react/24/solid";

const ReviewHeader = ({ showCompletion = false }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <BookOpenIcon className="h-8 w-8 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
              Review Session
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
              Study flashcards and rate your understanding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;
