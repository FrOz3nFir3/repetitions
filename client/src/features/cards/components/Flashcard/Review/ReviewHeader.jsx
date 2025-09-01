import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, FireIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../../authentication/state/authSlice";

const ReviewHeader = ({ showCompletion = false, cardId }) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleFocusReview = () => {
    navigate(`/card/${cardId}/focus-review`);
  };
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-between mb-4">
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

        {/* Focus Review Button - always show when not in completion */}
        {!showCompletion && (
          <button
            disabled={!user}
            onClick={handleFocusReview}
            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <FireIcon className="animate-pulse w-4 h-4" />
            <span>Focus Review</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewHeader;
