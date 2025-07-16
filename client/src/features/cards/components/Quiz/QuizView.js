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

  const review = useMemo(
    () =>
      card?.review.reduce((acc, current) => {
        const quizzes = current.quizzes || [];
        return acc.concat(quizzes);
      }, []) || [],
    [card]
  );

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
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          No Quiz Questions Available
        </h3>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-300">
          Add some quizzes from the edit page to start.
        </p>
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
    <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-2xl">
      <QuizHeader current={currentQuestionIndex + 1} total={review.length} />
      <QuizQuestion
        questionText={currentQuestion.quizQuestion}
        current={currentQuestionIndex + 1}
        total={review.length}
      />
      {selectedAnswer && showFacts ? (
        <RandomFact fact={randomFact} loading={factLoading} />
      ) : (
        <>
          <div className="mt-6 flex justify-center items-center space-x-3">
            <SparklesIcon
              className={`h-6 w-6 ${
                showFacts ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Fun Facts
            </span>
            <button
              onClick={handleRandomFactToggle}
              className={`${
                showFacts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
              } cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span
                className={`${
                  showFacts ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
          <div className="justify-center text-gray-500 dark:text-gray-400 my-4 text-sm flex items-center ">
            <LightBulbIcon className="h-5 w-5 mr-2" />
            <p>Select an option to test your knowledge.</p>
          </div>
        </>
      )}

      <QuizOptions
        options={shuffledOptions}
        answer={currentQuestion.quizAnswer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswerSelect}
      />
    </div>
  );
}

export default QuizView;
