import React from "react";
import { Link } from "react-router-dom";

const CardDetails = (data) => {
  const {
    _id,
    ["main-topic"]: mainTopic,
    ["sub-topic"]: subTopic,
    category,
    review,
    reviewLength = 0,
    showCategory,
    showContinue,
  } = data;

  return (
    <Link to={`/card/${_id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg h-full flex flex-col">
        <div className="flex-grow">
          {showCategory && (
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-1">
              {category}
            </p>
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
            {mainTopic}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-semibold mt-1 truncate">
            {subTopic}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {review?.length || reviewLength} flashcards
          </p>
          {showContinue && (
            <button className="pointer-events-none text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Continue →
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardDetails;
