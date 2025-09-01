import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentCard } from "../../state/cardSlice";
import { useQuizSession } from "../../hooks/useQuizSession";

import QuizResults from "./QuizResults";
import QuizSession from "./QuizSession";
import QuizEmptyState from "./QuizEmptyState";

function QuizView() {
  const card = useSelector(selectCurrentCard);
  const [isFinished, setIsFinished] = useState(false);

  const handleFinish = () => setIsFinished(true);

  const session = useQuizSession(card, handleFinish);

  const handleRestart = () => {
    session.restartQuiz();
    setIsFinished(false);
  };

  if (!card || !session.quizzes || session.quizzes.length === 0) {
    return <QuizEmptyState />;
  }

  if (isFinished) {
    return (
      <QuizResults
        score={session.score}
        totalQuestions={session.quizzes.length}
        onRestart={handleRestart}
        cardId={card._id}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <QuizSession session={session} cardId={card._id} />
    </div>
  );
}

export default QuizView;
