import React from "react";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const QuizQuestion = ({ questionText, current }) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg mb-6 relative">
      <div className="inline-flex left-4 bg-blue-500 text-white text-xs font-bold py-1 px-3 rounded-full">
        Question {current}
      </div>
      <div className="">
        <HtmlRenderer htmlContent={questionText} />
      </div>
    </div>
  );
};

export default QuizQuestion;
