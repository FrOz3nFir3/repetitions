import React, { useState, lazy } from "react";
import { ArrowPathIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

const DetailedReportModal = lazy(() =>
  import("../../../progress/components/DetailedReportModal")
);

const StatCard = ({ label, value, color }) => (
  <div
    className={`bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow-md text-center`}
  >
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const QuizResults = ({ score, totalQuestions, onRestart, cardId }) => {
  const user = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const incorrect = totalQuestions - score;

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Flawless Victory!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "You can do better!";
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl text-center">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
        {getPerformanceMessage()}
      </h2>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        You have completed the quiz.
      </p>

      <div className="my-8 flex justify-center items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-600"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                transition: "stroke-dashoffset 1s ease-out",
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 dark:text-white">
              {Math.round(percentage)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Score
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Questions"
          value={totalQuestions}
          color="text-gray-800 dark:text-white"
        />
        <StatCard label="Correct" value={score} color="text-green-500" />
        <StatCard label="Incorrect" value={incorrect} color="text-red-500" />
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={onRestart}
          className="cursor-pointer w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Take Again
        </button>
        {user && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer w-full sm:w-auto flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Detailed Report
          </button>
        )}
      </div>

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
