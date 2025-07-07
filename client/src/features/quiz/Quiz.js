import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePatchUpdateUserMutation } from "../../api/apiSlice";
import { selectCurrentCard } from "../cards/cardSlice";
import { selectCurrentUser, modifyUser } from "../authentication/authSlice";
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
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

  // Memoize the shuffled options so they don't re-shuffle on every render
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

  const handleAnswerSelect = (option) => {
    if (selectedAnswer) return;

    const isCorrect = option === currentQuestion.answer;
    setSelectedAnswer({ option, isCorrect });

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
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-gray-800">Quiz Finished!</h2>
        <p className="mt-4 text-xl text-gray-600">
          Your score: <span className="font-bold text-indigo-600">{score}</span>{" "}
          / {review.length}
        </p>
        <button
          onClick={restartQuiz}
          className="mt-6 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Quiz Time!</h2>
        <p className="mt-2 text-md text-gray-600">
          Test your knowledge by selecting the correct answer.
        </p>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {review.length}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          {currentQuestion.question}
        </h2>
      </div>
      <div className="space-y-4">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer?.option === option;
          const isCorrect = currentQuestion.answer === option;

          let buttonClass =
            "w-full text-left p-4 rounded-lg border-2 transition-colors ";
          if (isSelected) {
            buttonClass += selectedAnswer.isCorrect
              ? "bg-green-100 border-green-500"
              : "bg-red-100 border-red-500";
          } else if (selectedAnswer && isCorrect) {
            // Highlight the correct answer if a wrong one was chosen
            buttonClass += "bg-green-100 border-green-500";
          } else {
            buttonClass += "bg-gray-50 hover:bg-gray-100 border-gray-200";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{option}</span>
                {isSelected &&
                  (isCorrect ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-red-500" />
                  ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-center text-gray-500 mt-4 text-sm flex items-center justify-center">
        <LightBulbIcon className="h-5 w-5 mr-2" />
        Select an option to see if you are correct.
      </div>
    </div>
  );
}

export default Quiz;
