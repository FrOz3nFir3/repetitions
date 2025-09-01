import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizOptions from "./QuizOptions";
import RandomFact from "./RandomFact";
import QuizTips from "./QuizTips";
import FunFactToggle from "./FunFactToggle";

const QuizSession = ({ session, cardId }) => {
  const {
    quizzes,
    currentQuestionIndex,
    selectedAnswer,
    randomFact,
    factLoading,
    showFacts,
    currentQuestion,
    shuffledOptions,
    handleAnswerSelect,
    handleRandomFactToggle,
  } = session;

  return (
    <div className="relative z-10 p-6 sm:p-8">
      <QuizHeader 
        current={currentQuestionIndex + 1} 
        total={quizzes.length}
        cardId={cardId}
      />

      {currentQuestionIndex === 0 && !selectedAnswer && (
        <QuizTips className="mb-6" />
      )}

      <QuizQuestion
        questionText={currentQuestion.quizQuestion}
        current={currentQuestionIndex + 1}
      />

      <QuizOptions
        options={shuffledOptions}
        answer={currentQuestion.quizAnswer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswerSelect}
      />

      {selectedAnswer && showFacts && (
        <div className="mt-6">
          <RandomFact
            fact={randomFact}
            loading={factLoading}
            shouldAutoScroll={selectedAnswer?.isCorrect}
          />
        </div>
      )}

      <FunFactToggle showFacts={showFacts} onToggle={handleRandomFactToggle} />
    </div>
  );
};

export default QuizSession;
