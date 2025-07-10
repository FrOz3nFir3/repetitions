import React from "react";

const QuizHeader = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Quiz Time!
          </h2>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
            Test your knowledge by selecting the correct answer.
          </p>
        </div>
        <p className="text-xl font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">
          {current} / {total}
        </p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizHeader;
