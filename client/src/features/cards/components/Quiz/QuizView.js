import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePatchUpdateUserProgressMutation } from "../../../../api/apiSlice";
import { selectCurrentCard } from "../../state/cardSlice";
import {
  selectCurrentUser,
  modifyUser,
} from "../../../authentication/state/authSlice";
import { CogIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import QuizResults from "./QuizResults";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizOptions from "./QuizOptions";

function QuizView() {
  const dispatch = useDispatch();
  const card = useSelector(selectCurrentCard);
  const user = useSelector(selectCurrentUser);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [updateUser] = usePatchUpdateUserProgressMutation();

  const review = useMemo(
    () =>
      card?.review.reduce((previous, current) => {
        const quizzesSoFar = current.quizzes || [];
        // TODO: optimize this later
        for (let quiz of quizzesSoFar) {
          let newQuiz = { ...quiz };
        }
        return previous.concat(quizzesSoFar);
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
      // Optimistic updates
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
  };

  if (!card) return null;

  if (review.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-gray-800  rounded-xl shadow-md">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          No Quiz to show!
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Add some quizzes from Edit Flashcards to start a quiz.
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <QuizHeader current={currentQuestionIndex + 1} total={review.length} />
      <QuizQuestion questionText={currentQuestion.quizQuestion} />
      <QuizOptions
        options={shuffledOptions}
        answer={currentQuestion.quizAnswer}
        selectedAnswer={selectedAnswer}
        onSelect={handleAnswerSelect}
      />
      <div className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm flex items-center justify-center">
        <LightBulbIcon className="h-5 w-5 mr-2" />
        <p>Select an option to test your knowledge.</p>
      </div>
    </div>
  );
}

export default QuizView;
