import React from "react";
import { Link } from "react-router-dom";

const ProgressBar = ({ label, value }) => (
  <div className="mt-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {value}%
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`${
          label === "Accuracy" ? "bg-green-500" : "bg-indigo-600"
        } h-2.5 rounded-full`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const DeckProgressCard = ({ progress, cardDetails, onViewReport }) => {
  if (!cardDetails) return null; // Don't render if the card details haven't loaded yet

  // --- All calculation logic for a single card is now contained here ---
  const correct = progress["total-correct"] || 0;
  const incorrect = progress["total-incorrect"] || 0;
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const timesStarted = progress["times-started"] || 0;
  const timesFinished = progress["times-finished"] || 0;
  const completion =
    timesStarted > 0 ? Math.round((timesFinished / timesStarted) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
          {cardDetails.category}
        </p>
        <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white truncate">
          {cardDetails["main-topic"]}
        </h3>
        <p className="text-md text-gray-700 dark:text-gray-300 truncate">
          {cardDetails["sub-topic"]}
        </p>

        <ProgressBar label="Accuracy" value={accuracy} />
        <ProgressBar label="Completion" value={completion} />

        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Started</p>
            <p className="text-lg font-bold text-blue-600">{timesStarted}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Finished</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {timesFinished}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
            <p className="text-lg font-bold text-green-600">{correct}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Incorrect
            </p>
            <p className="text-lg font-bold text-red-600">{incorrect}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 mt-auto">
        <Link
          to={`/card/${progress.card_id}/quiz`}
          className="w-full text-center block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          Continue Studying
        </Link>
        <button
          onClick={() => onViewReport(progress)}
          className="cursor-pointer w-full text-center block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 mt-2"
        >
          View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default DeckProgressCard;
