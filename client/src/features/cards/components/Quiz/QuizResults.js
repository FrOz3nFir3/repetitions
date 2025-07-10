import React, { useState, lazy } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

// Lazy load the modal to keep the initial bundle small
const DetailedReportModal = lazy(() =>
  import("../../../progress/components/DetailedReportModal")
);

const QuizResults = ({ score, totalQuestions, onRestart, cardId }) => {
  const user = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return (
    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-300">
        Quiz Complete!
      </h2>
      <p className="mt-4 text-2xl text-gray-600 dark:text-white">You scored</p>
      <p className="text-6xl font-extrabold text-indigo-600 my-4">
        {score} / {totalQuestions}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-4 my-4 max-w-md">
        <div
          className="bg-indigo-600 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <button
        onClick={onRestart}
        className="cursor-pointer mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
      >
        <ArrowPathIcon className="h-6 w-6 mr-3" />
        Take Again
      </button>
      {user && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer mt-4 inline-flex items-center justify-center text-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          View Detailed Report
        </button>
      )}
      {isModalOpen && (
        <DetailedReportModal
          isOpen={isModalOpen}
          cardId={cardId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default QuizResults;
