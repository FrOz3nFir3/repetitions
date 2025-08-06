import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

const GuestAccessNote = () => {
  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-700/50 dark:to-indigo-900/20 rounded-xl border border-gray-200 dark:border-gray-600">
      <div className="flex items-start space-x-3">
        <EyeIcon className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Try Before You Commit
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Browse flashcards and take quizzes as a guest. Create an account
            when you're ready to unlock all features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestAccessNote;
