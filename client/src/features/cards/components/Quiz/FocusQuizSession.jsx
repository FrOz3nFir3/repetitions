import React from "react";
import {
  ArrowsRightLeftIcon,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import FocusQuizHeader from "./FocusQuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizOptions from "./QuizOptions";
import RandomFact from "./RandomFact";
import FunFactToggle from "./FunFactToggle";
import FocusQuizCompletion from "./FocusQuizCompletion";
import FocusQuizGallery from "./FocusQuizGallery";

const FocusQuizSession = ({ focusQuizzes, session }) => {
  const {
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    score,
    shuffledOptions,
    sessionQuizzes,
    showCompletion,
    completedQuizzes,
    randomFact,
    factLoading,
    showFacts,
    handleAnswerSelect,
    handleRandomFactToggle,
    handleQuizSelect,
    handleNext,
    handlePrev,
    restartFocusQuiz,
    isFirstQuestion,
    isLastQuestion,
  } = session;

  const progressPercentage =
    sessionQuizzes.length > 0
      ? ((currentQuestionIndex + 1) / sessionQuizzes.length) * 100
      : 0;

  if (showCompletion) {
    return (
      <div className="relative z-10 p-6 sm:p-8">
        <FocusQuizCompletion
          score={score}
          totalQuestions={sessionQuizzes.length}
          completedQuizzesCount={completedQuizzes.size}
          totalFocusQuizzes={focusQuizzes.length}
          restartFocusQuiz={restartFocusQuiz}
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 p-6 sm:p-8">
      <FocusQuizHeader
        current={currentQuestionIndex + 1}
        total={sessionQuizzes.length}
        focusQuizzesCount={focusQuizzes.length}
        score={score}
      />

      {/* Difficulty Indicator - No Tips, Emphasize Challenge */}
      {currentQuestionIndex === 0 && !selectedAnswer && (
        <div className="mb-6 text-center inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-red-200/50 dark:border-red-500/30">
          <p className="text-sm text-orange-700 dark:text-orange-300 text-center">
            <strong>Focus Mode:</strong> You're giving quiz on which you got
            wrong previously. Take them again and improve your learning!
          </p>
        </div>
      )}

      <QuizQuestion
        questionText={currentQuestion.quizQuestion}
        current={currentQuestionIndex + 1}
        isFocusMode={true}
      />

      <QuizOptions
        options={shuffledOptions}
        answer={currentQuestion.quizAnswer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswerSelect}
        isFocusMode={true}
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

      {/* Navigation and Gallery */}
      {sessionQuizzes.length > 1 && (
        <>
          {/* Progress Indicator with Navigation */}
          <div className="mb-6">
            <div className="w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-full h-2 shadow-inner">
              <div
                className="bg-gradient-to-r from-red-500 via-orange-600 to-red-600 h-2 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Navigation Controls on the right */}
            <div className="flex items-center justify-between mt-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ArrowsRightLeftIcon className="h-4 w-4" />
                Use Left/Right arrow keys to navigate
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  disabled={isFirstQuestion}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm border ${
                    isFirstQuestion
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                      : "bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:shadow-md"
                  }`}
                  title={
                    isFirstQuestion
                      ? "Already at first question"
                      : "Previous question"
                  }
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Prev</span>
                </button>

                <div className="px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-md text-sm font-medium border border-orange-200 dark:border-orange-500/30">
                  {currentQuestionIndex + 1} / {sessionQuizzes.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={isLastQuestion}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-sm border ${
                    isLastQuestion
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 cursor-not-allowed"
                      : "bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:shadow-md"
                  }`}
                  title={
                    isLastQuestion
                      ? "Already at last question"
                      : "Next question"
                  }
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <FocusQuizGallery
            quizzes={focusQuizzes}
            currentQuestion={currentQuestion}
            handleQuizSelect={handleQuizSelect}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswer={selectedAnswer}
          />
        </>
      )}
    </div>
  );
};

export default FocusQuizSession;
