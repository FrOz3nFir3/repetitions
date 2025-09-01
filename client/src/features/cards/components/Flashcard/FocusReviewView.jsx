import React, { useEffect } from "react";
import { useFocusSession } from "../../hooks/useFocusSession";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";
import FocusReviewEmptyState from "./Review/FocusReviewEmptyState";
import FocusReviewSession from "./Review/FocusReviewSession";

function FocusReviewView({ card, onCardMastered }) {
  const { review = [], weakCards = [] } = card ?? {};
  const user = useSelector(selectCurrentUser);
  const session = useFocusSession(review, card?._id, weakCards, onCardMastered);

  useEffect(() => {
    if (session.showCompletion || session.hasNoWeakCards) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") session.handleNext();
      else if (event.key === "ArrowLeft") session.handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    session.showCompletion,
    session.hasNoWeakCards,
    session.handleNext,
    session.handlePrev,
  ]);

  // Show empty state if user has no weak cards
  if (!user || session.hasNoWeakCards) {
    // Check if user has review data (reviewLength > 0 indicates they've done reviews)
    const hasReviewData = card?.reviewLength > 0;
    return <FocusReviewEmptyState hasReviewData={hasReviewData} />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-orange-950 shadow-2xl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <FocusReviewSession
        focusCards={session.focusCards}
        session={session}
        key={`session-${card?._id}-${weakCards?.length || 0}`}
      />
    </div>
  );
}

export default FocusReviewView;
