import React from "react";

const QuizHeader = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Quiz Time!
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300">
            Test your knowledge by selecting the correct answer.
          </p>
        </div>
        <span className="shrink-0 text-xl font-semibold text-gray-600 dark:text-gray-300 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizHeader;
