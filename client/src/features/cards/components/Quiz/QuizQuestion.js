import React from "react";

const QuizQuestion = ({ questionText }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {questionText}
      </h3>
    </div>
  );
};

export default QuizQuestion;
