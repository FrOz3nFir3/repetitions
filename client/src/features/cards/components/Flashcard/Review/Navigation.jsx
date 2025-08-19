import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Navigation = ({
  handlePrev,
  handleNext,
  currentIndex,
  filteredReviewLength,
  progressPercentage,
  showEditIcon = true,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleEdit = () => {
    navigate(`/card/${params.id}/edit?view=flashcards&${searchParams}`);
  };

  return (
    <div className="mt-6 mb-8">
      <div className="flex flex-wrap gap-4 justify-center sm:justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <ChartBarIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                Card {currentIndex + 1} of {filteredReviewLength}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
          {showEditIcon && (
            <button
              className="cursor-pointer group p-3 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleEdit}
            >
              <PencilSquareIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="cursor-pointer group p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= filteredReviewLength - 1}
            className="cursor-pointer group p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Start</span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
