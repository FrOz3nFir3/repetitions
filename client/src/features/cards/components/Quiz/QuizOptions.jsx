import React from "react";
import OptionButton from "./OptionButton";

const QuizOptions = ({ options, answer, selectedAnswer, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option, index) => (
        <OptionButton
          key={index}
          option={option}
          answer={answer}
          selectedAnswer={selectedAnswer}
          onSelect={onSelect}
          index={index}
        />
      ))}
    </div>
  );
};

export default QuizOptions;
