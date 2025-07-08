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
          if (user) {
            const updateDetails = {
              card_id: _id,
              email: user.email,
              type: "times-finished",
            };
            updateUser(updateDetails).then((res) =>
              dispatch(modifyUser(updateDetails))
            );
          }
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedAnswer, currentQuestionIndex, review.length]);

  const handleAnswerSelect = (option, index) => {
    if (selectedAnswer) return;

    const isCorrect = option === currentQuestion.answer;
    setSelectedAnswer({ option, isCorrect });

    const hasStarted = currentQuestionIndex === 0 ? true : false;
    if (user && hasStarted) {
      const updateDetails = {
        card_id: _id,
        email: user.email,
        type: "times-started",
      };
      updateUser(updateDetails).then((res) =>
        dispatch(modifyUser(updateDetails))
      );
    }

    if (isCorrect) {
      setScore(score + 1);
      if (user) {
        const updateDetails = {
          card_id: _id,
          email: user.email,
          type: "total-correct",
        };
        updateUser(updateDetails).then((res) =>
          dispatch(modifyUser(updateDetails))
        );
      }
    } else {
      if (user) {
        const updateDetails = {
          card_id: _id,
          email: user.email,
          type: "total-incorrect",
        };
        updateUser(updateDetails).then((res) =>
          dispatch(modifyUser(updateDetails))
        );
      }
    }
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
      <div className="text-center py-10 bg-white rounded-xl shadow-md flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800">Quiz Complete!</h2>
        <p className="mt-4 text-2xl text-gray-600">You scored</p>
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
          className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-4 text-lg font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          <ArrowPathIcon className="h-6 w-6 mr-3" />
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quiz Time!</h2>
            <p className="mt-2 text-md text-gray-600">
              Test your knowledge by selecting the correct answer.
            </p>
          </div>
          <p className="text-xl font-semibold text-gray-600 whitespace-nowrap">
            {currentQuestionIndex + 1} / {review.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / review.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {currentQuestion.question}
        </h3>
      </div>
      <div className="space-y-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer?.option === option;
          const isCorrect = currentQuestion.answer === option;

          let buttonClass =
            "cursor-pointer w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ";
          if (isSelected) {
            buttonClass += selectedAnswer.isCorrect
              ? "bg-green-100 border-green-500 ring-4 ring-green-200"
              : "bg-red-100 border-red-500 ring-4 ring-red-200";
          } else if (selectedAnswer && isCorrect) {
            buttonClass += "bg-green-100 border-green-500";
          } else {
            buttonClass += "bg-gray-50 hover:bg-indigo-50 border-gray-200";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option, index)}
              disabled={!!selectedAnswer}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{option}</span>
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
      <div className="text-center text-gray-500 mt-6 text-sm flex items-center justify-center">
        <LightBulbIcon className="h-5 w-5 mr-2" />
        <p>Select an option to test your knowledge.</p>
      </div>
    </div>
  );
}

export default Quiz;
