import React from "react";
import { getTextFromHtml } from "../../../../../utils/dom";
import FlashcardFront from "./partials/FlashcardFront";
import FlashcardBack from "./partials/FlashcardBack";
import FlashcardEmptyState from "./partials/FlashcardEmptyState";

const Flashcard = ({
  viewOnly = false,
  currentFlashcard,
  isFlipped,
  setIsFlipped,
  getSlideClass,
  currentIndex,
  totalCards,
  showFeedbackIndicator = false,
  isReviewCard = false,
}) => {
  const isQuestionEmpty =
    !currentFlashcard?.question ||
    getTextFromHtml(currentFlashcard.question).trim() === "";
  const isAnswerEmpty =
    !currentFlashcard?.answer ||
    getTextFromHtml(currentFlashcard.answer).trim() === "";

  return (
    <div className="flex items-center justify-center mb-6">
      <div
        className={`w-full max-w-5xl ${getSlideClass?.()}`}
        style={{ perspective: "1200px" }}
      >
        {currentFlashcard ? (
          <div
            className="h-[34rem] relative w-full transition-transform duration-700 cursor-pointer group" // h-134 is not a standard tailwind class, assuming 34rem
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <React.Fragment key={currentFlashcard._id}>
              <FlashcardFront
                isReviewCard={isReviewCard}
                currentIndex={currentIndex}
                totalCards={totalCards}
                isQuestionEmpty={isQuestionEmpty}
                questionContent={currentFlashcard.question}
                viewOnly={viewOnly}
                isFlipped={isFlipped}
              />
              <FlashcardBack
                isReviewCard={isReviewCard}
                currentIndex={currentIndex}
                totalCards={totalCards}
                isAnswerEmpty={isAnswerEmpty}
                answerContent={currentFlashcard.answer}
                viewOnly={viewOnly}
                showFeedbackIndicator={showFeedbackIndicator}
                isFlipped={isFlipped}
              />
            </React.Fragment>
          </div>
        ) : (
          <FlashcardEmptyState />
        )}
      </div>
    </div>
  );
};

export default Flashcard;
