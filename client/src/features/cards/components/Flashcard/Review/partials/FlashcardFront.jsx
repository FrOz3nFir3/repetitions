import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../../../components/ui/HtmlRenderer";

const FlashcardFront = ({
  isReviewCard,
  currentIndex,
  totalCards,
  isQuestionEmpty,
  questionContent,
  viewOnly,
}) => {
  return (
    <div
      className={`absolute w-full h-full max-h-134 ${
        isReviewCard
          ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 border-4 border-orange-300/40"
          : "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 border-4 border-blue-300/40"
      } rounded-3xl shadow-2xl text-white flex flex-col`}
      style={{
        backfaceVisibility: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm border border-white/40 flex-shrink-0">
            <QuestionMarkCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-white text-sm font-medium truncate">
              {isReviewCard ? `Question ${currentIndex + 1}` : "Question"}
            </span>
          </div>
        </div>
        {isReviewCard ? (
          <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40 flex-shrink-0">
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
        {isQuestionEmpty ? (
          <div className="text-center text-white/70 italic">
            <p className="text-lg font-semibold">Front Side Preview</p>
            <p className="text-sm">Content will appear here as you type.</p>
          </div>
        ) : (
          <HtmlRenderer
            className="max-w-full !text-sm sm:!text-xl leading-relaxed"
            htmlContent={questionContent}
          />
        )}
      </div>

      {/* Footer */}
      {!viewOnly && (
        <div className="flex-shrink-0 mt-auto pb-4 text-center">
          <div className="inline-block text-white/90 text-xs sm:text-sm bg-white/20 px-3 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-white/30">
            Click to reveal answer
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardFront;
