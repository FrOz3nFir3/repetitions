import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Navigation = ({
  handlePrev,
  handleNext,
  currentIndex,
  filteredReviewLength,
  progressPercentage,
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleEdit = () => {
    navigate(`/card/${params.id}/edit?${searchParams}`);
  };
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-200 ">
            Card {currentIndex + 1} of {filteredReviewLength}
          </p>
          <button
            className="cursor-pointer hover:opacity-50"
            onClick={handleEdit}
          >
            <PencilSquareIcon className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={filteredReviewLength === 0}
            className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-700 dark:text-white" />
          </button>
          <button
            onClick={handleNext}
            disabled={filteredReviewLength === 0}
            className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Navigation;
