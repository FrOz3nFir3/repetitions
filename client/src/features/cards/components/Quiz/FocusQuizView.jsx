import React, { useEffect } from "react";
import { useFocusQuiz } from "../../hooks/useFocusQuiz";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";
import FocusQuizEmptyState from "./FocusQuizEmptyState";
import FocusQuizSession from "./FocusQuizSession";

function FocusQuizView({ card, onQuizMastered }) {
  const { quizzes = [], strugglingQuizzes = [] } = card ?? {};
  const user = useSelector(selectCurrentUser);
  const session = useFocusQuiz(card, card?._id, strugglingQuizzes, onQuizMastered);

  useEffect(() => {
    if (session.showCompletion || session.hasNoStrugglingQuizzes) return;

    const handleKeyDown = (event) => {
      // Respect navigation boundaries for keyboard navigation
      if (event.key === "ArrowRight" && !session.isLastQuestion) {
        session.handleNext();
      } else if (event.key === "ArrowLeft" && !session.isFirstQuestion) {
        session.handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    session.showCompletion,
    session.hasNoStrugglingQuizzes,
    session.handleNext,
    session.handlePrev,
    session.isFirstQuestion,
    session.isLastQuestion,
  ]);

  // Show empty state if user has no struggling quizzes
  if (!user || session.hasNoStrugglingQuizzes) {
    // Check if user has quiz data (quizzesLength > 0 indicates they've done quizzes)
    const hasQuizData = card?.quizzesLength > 0;
    return <FocusQuizEmptyState hasQuizData={hasQuizData} />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-orange-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-red-950 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-red-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <FocusQuizSession
        focusQuizzes={session.focusQuizzes}
        session={session}
        key={`session-${card?._id}-${strugglingQuizzes?.length || 0}`}
      />
    </div>
  );
}

export default FocusQuizView;