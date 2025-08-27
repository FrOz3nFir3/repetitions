import React, { useEffect } from "react";
import { useReviewSession } from "../../hooks/useReviewSession";
import ReviewEmptyState from "./Review/ReviewEmptyState";
import ReviewSession from "./Review/ReviewSession";

function Review({ card }) {
  const { review = [] } = card ?? {};
  const session = useReviewSession(review, card?._id);

  useEffect(() => {
    if (session.showCompletion) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") session.handleNext();
      else if (event.key === "ArrowLeft") session.handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session.showCompletion, session.handleNext, session.handlePrev]);

  if (!review || review.length === 0) {
    return <ReviewEmptyState />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <ReviewSession review={review} session={session} />
    </div>
  );
}

export default Review;
