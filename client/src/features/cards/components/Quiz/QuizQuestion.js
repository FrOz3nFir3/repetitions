import React from "react";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";

const QuizQuestion = ({ questionText }) => {
  return (
    <div className="mb-6">
      <div>
        <HtmlRenderer htmlContent={questionText} />
      </div>
    </div>
  );
};

export default QuizQuestion;
