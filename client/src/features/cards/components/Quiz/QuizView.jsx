import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePatchUpdateUserProgressMutation } from "../../../../api/apiSlice";
import { selectCurrentCard } from "../../state/cardSlice";
import {
  selectCurrentUser,
  modifyUser,
} from "../../../authentication/state/authSlice";
import { LightBulbIcon, SparklesIcon } from "@heroicons/react/24/solid";
import QuizResults from "./QuizResults";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizOptions from "./QuizOptions";
import RandomFact from "./RandomFact";
import QuizTips from "./QuizTips";

function QuizView() {
  const dispatch = useDispatch();
  const card = useSelector(selectCurrentCard);
  const user = useSelector(selectCurrentUser);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [randomFact, setRandomFact] = useState(null);
  const [factLoading, setFactLoading] = useState(false);
  const defaultShowFacts =
    (localStorage.getItem("quiz-show-fun-facts") ?? "true") === "true";
  const [showFacts, setShowFacts] = useState(defaultShowFacts);

  const [updateUser] = usePatchUpdateUserProgressMutation();

  const review = useMemo(() => card?.quizzes || [], [card]);

  const currentQuestion = useMemo(
    () => review[currentQuestionIndex],
    [review, currentQuestionIndex]
  );

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.quizAnswer,
      ...(currentQuestion.options || [])
        .map((opt) => opt.value)
        .filter((opt) => opt !== currentQuestion.quizAnswer),
    ];
    return options.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleRandomFactToggle = () => {
    setShowFacts((prev) => {
      localStorage.setItem("quiz-show-fun-facts", !prev);
      return !prev;
    });
  };

  const fetchRandomFact = useCallback(async () => {
    setFactLoading(true);
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );
      const data = await response.json();
      setRandomFact(data.text);
    } catch (error) {
      console.error("Failed to fetch random fact:", error);
      setRandomFact("Could not load a fun fact, but you're doing great!");
    }
    setFactLoading(false);
  }, []);

  useEffect(() => {
    if (selectedAnswer) {
      if (showFacts) {
        fetchRandomFact();
      }
      const timerValue = showFacts ? 3500 : 1500;
      const timer = setTimeout(() => {
        if (currentQuestionIndex < review.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setRandomFact(null);
        } else {
          setIsFinished(true);
        }
      }, timerValue);
      return () => clearTimeout(timer);
    }
  }, [
    selectedAnswer,
    currentQuestionIndex,
    review.length,
    fetchRandomFact,
    showFacts,
  ]);

  const handleAnswerSelect = (option) => {
    if (selectedAnswer || !currentQuestion) return;

    const isCorrect = option === currentQuestion.quizAnswer;
    if (isCorrect) setScore(score + 1);
    setSelectedAnswer({ option, isCorrect });

    if (!user) return;

    const updateDetails = {
      card_id: card._id,
      quiz_id: currentQuestion._id,
      correct: isCorrect,
      isFirstQuestion: currentQuestionIndex === 0,
      isLastQuestion: currentQuestionIndex === review.length - 1,
    };

    updateUser(updateDetails).then(() => {
      if (updateDetails.isFirstQuestion)
        dispatch(modifyUser({ card_id: card._id, type: "times-started" }));
      if (updateDetails.isLastQuestion)
        dispatch(modifyUser({ card_id: card._id, type: "times-finished" }));
      if (updateDetails.correct)
        dispatch(modifyUser({ card_id: card._id, type: "total-correct" }));
      else dispatch(modifyUser({ card_id: card._id, type: "total-incorrect" }));
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setRandomFact(null);
  };

  if (!card || review.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center py-16 px-8">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg inline-block mb-6">
            <SparklesIcon className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent mb-4">
            No Quiz Questions Available
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Add some quizzes from the edit page to start your learning journey.
          </p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <QuizResults
        score={score}
        totalQuestions={review.length}
        onRestart={restartQuiz}
        cardId={card._id}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <QuizHeader current={currentQuestionIndex + 1} total={review.length} />
        {currentQuestionIndex === 0 && !selectedAnswer && (
          <QuizTips className="mb-6" />
        )}
        <QuizQuestion
          questionText={currentQuestion.quizQuestion}
          current={currentQuestionIndex + 1}
          total={review.length}
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

        <div className="mt-8 mb-6 flex justify-center items-center">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
            <div className="flex items-center space-x-4">
              <SparklesIcon
                className={`h-6 w-6 transition-colors duration-300 ${
                  showFacts ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Fun Facts
              </span>
              <button
                onClick={handleRandomFactToggle}
                className={`${
                  showFacts
                    ? "bg-gradient-to-r from-purple-500 to-pink-600"
                    : "bg-gray-300 dark:bg-gray-600"
                } cursor-pointer relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-lg hover:shadow-xl`}
              >
                <span
                  className={`${
                    showFacts ? "translate-x-6" : "translate-x-1"
                  } inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizView;
