import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePatchUpdateUserMutation } from "../../api/apiSlice";
import { selectCurrentCard } from "../cards/cardSlice";
import { selectCurrentUser, modifyUser } from "../authentication/authSlice";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

function Quiz() {
  const dispatch = useDispatch();
  const card = useSelector(selectCurrentCard);
  const user = useSelector(selectCurrentUser);
  const { _id, review = [] } = card;

  const [updateUser] = usePatchUpdateUserMutation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = review[currentQuestionIndex];

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.answer,
      ...(currentQuestion.options || []).filter(
        (opt) => opt !== currentQuestion.answer
      ),
    ];
    return options.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  useEffect(() => {
    if (selectedAnswer) {
      const timer = setTimeout(() => {
        if (currentQuestionIndex < review.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
        } else {
          setIsFinished(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, currentQuestionIndex, review.length]);

  const handleAnswerSelect = (option, index) => {
    if (selectedAnswer) return;

    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setSelectedAnswer({ option, isCorrect });

    if (!user) return;

    // Construct a single, comprehensive payload for the backend
    const updateDetails = {
      email: user.email,
      card_id: _id,
      flashcard_id: currentQuestion.cardId,
      correct: isCorrect,
      isFirstQuestion: currentQuestionIndex === 0,
      isLastQuestion: currentQuestionIndex === review.length - 1,
    };

    // Single API call to update all user progress
    updateUser(updateDetails).then((res) => {
      // conditionally update user state
      if (updateDetails.isFirstQuestion) {
        dispatch(
          modifyUser({ card_id: updateDetails.card_id, type: "times-started" })
        );
      }

      if (updateDetails.isLastQuestion) {
        dispatch(
          modifyUser({ card_id: updateDetails.card_id, type: "times-finished" })
        );
      }

      if (updateDetails.correct) {
        dispatch(
          modifyUser({ card_id: updateDetails.card_id, type: "total-correct" })
        );
      } else {
        dispatch(
          modifyUser({
            card_id: updateDetails.card_id,
            type: "total-incorrect",
          })
        );
      }
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  if (review.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-900">
          No flashcards for a quiz!
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Add some flashcards to start a quiz.
        </p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-300">
          Quiz Complete!
        </h2>
        <p className="mt-4 text-2xl text-gray-600 dark:text-white">
          You scored
        </p>
        <p className="text-6xl font-extrabold text-indigo-600 my-4">
          {score} / {review.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 my-4">
          <div
            className="bg-indigo-600 h-4 rounded-full"
            style={{ width: `${(score / review.length) * 100}%` }}
          ></div>
        </div>
        <button
          onClick={restartQuiz}
          className="cursor-pointer mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowPathIcon className="h-6 w-6 mr-3" />
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
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
            {currentQuestionIndex + 1} / {review.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / review.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {currentQuestion.question}
        </h3>
      </div>
      <div className="space-y-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer?.option === option;
          const isCorrect = currentQuestion.answer === option;

          let buttonClass =
            "dark:text-white cursor-pointer w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ";
          if (isSelected) {
            buttonClass += selectedAnswer.isCorrect
              ? "bg-green-100 border-green-500 ring-4 ring-green-200 dark:!text-black"
              : "bg-red-100 border-red-500 ring-4 ring-red-200 dark:!text-black";
          } else if (selectedAnswer && isCorrect) {
            buttonClass += "bg-green-100 border-green-500 dark:!text-black";
          } else {
            buttonClass +=
              "dark:text-black bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option, index)}
              disabled={!!selectedAnswer}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg ">{option}</span>
                {isSelected &&
                  (isCorrect ? (
                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-8 w-8 text-red-500" />
                  ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm flex items-center justify-center">
        <LightBulbIcon className="h-5 w-5 mr-2" />
        <p>Select an option to test your knowledge.</p>
      </div>
    </div>
  );
}

export default Quiz;
