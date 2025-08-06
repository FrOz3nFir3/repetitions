import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizOptions from "./QuizOptions";
import RandomFact from "./RandomFact";
import QuizTips from "./QuizTips";
import FunFactToggle from "./FunFactToggle";

const QuizSession = ({ session }) => {
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
      <QuizHeader current={currentQuestionIndex + 1} total={quizzes.length} />

      {currentQuestionIndex === 0 && !selectedAnswer && (
        <QuizTips className="mb-6" />
      )}

      <QuizQuestion
        questionText={currentQuestion.quizQuestion}
        current={currentQuestionIndex + 1}
      />

      {selectedAnswer && showFacts && (
        <RandomFact fact={randomFact} loading={factLoading} />
      )}

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2">
          <LightBulbIcon className="h-5 w-5" />
          <p className="text-sm font-medium">
            Select an option to test your knowledge
          </p>
        </div>
      </div>

      <QuizOptions
        options={shuffledOptions}
        answer={currentQuestion.quizAnswer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswerSelect}
      />

      <FunFactToggle showFacts={showFacts} onToggle={handleRandomFactToggle} />
    </div>
  );
};

export default QuizSession;
