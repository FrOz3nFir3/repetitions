import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../../../components/ui/HtmlRenderer";

const FlashcardBack = ({
  isReviewCard,
  currentIndex,
  totalCards,
  isAnswerEmpty,
  answerContent,
  viewOnly,
  showFeedbackIndicator,
}) => {
  return (
    <div
      className="absolute w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 rounded-3xl shadow-2xl border-4 border-blue-300/40 text-white flex flex-col"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm border border-white/40">
            <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-white text-sm font-medium inline">Answer</span>
        </div>

        {isReviewCard ? (
          <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40">
            Review
          </div>
        ) : (
          typeof currentIndex !== "undefined" && (
            <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40 flex-shrink-0">
              {currentIndex + 1} / {totalCards}
            </div>
          )
        )}
      </div>

      {/* Content */}
      <div className="flex-1 max-h-96 flex items-center justify-center px-2 pl-4">
        {isAnswerEmpty ? (
          <div className="text-center text-white/70 italic">
            <p className="text-lg font-semibold">Back Side Preview</p>
            <p className="text-sm">Content will appear here as you type.</p>
          </div>
        ) : (
          <HtmlRenderer
            className="max-w-full !text-sm sm:!text-xl leading-relaxed"
            htmlContent={answerContent}
          />
        )}
      </div>

      {/* Footer */}
      {!viewOnly && (
        <div className="flex-shrink-0 mt-auto pt-2 pb-4 text-center">
          <div className="inline-block text-white/90 text-xs sm:text-sm bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-white/30">
            Click to see question
          </div>
          {showFeedbackIndicator && (
            <div className="mt-3">
              <div className="flex items-center justify-center gap-1 text-white/80 text-xs animate-bounce">
                <span>↓</span>
                <span>Rate your knowledge below</span>
                <span>↓</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardBack;
