import React from "react";
import {
  QuestionMarkCircleIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../../components/ui/HtmlRenderer";

const Flashcard = ({
  viewOnly = false,
  currentFlashcard,
  isFlipped,
  setIsFlipped,
  getSlideClass,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  currentIndex,
  totalCards,
  showFeedbackIndicator = false,
  isReviewCard = false,
}) => (
  <div
    className="flex items-center justify-center mb-6"
    // on mobile where overflow happens the sliding leads to swiping and next card
    // onTouchStart={handleTouchStart}
    // onTouchMove={handleTouchMove}
    // onTouchEnd={handleTouchEnd}
  >
    <div
      className={`w-full max-w-4xl ${getSlideClass?.()}`}
      style={{ perspective: "1200px" }}
    >
      {currentFlashcard ? (
        <div
          className="h-134 relative w-full transition-transform duration-700 cursor-pointer group"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side - Question */}
          <div
            className={`absolute w-full h-full max-h-134 ${
              isReviewCard
                ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 border-4 border-orange-300/40"
                : "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 border-4 border-blue-300/40"
            } rounded-3xl shadow-2xl text-white flex flex-col`}
            style={{
              backfaceVisibility: "hidden",
              pointerEvents: isFlipped ? "none" : "auto",
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
                <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40 flex-shrink-0">
                  {currentIndex + 1} / {totalCards}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 max-h-96 flex items-center justify-center px-2 pl-4">
              <HtmlRenderer
                className="max-w-full !text-sm sm:!text-xl  leading-relaxed"
                htmlContent={currentFlashcard.question}
              />
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

          {/* Back Side - Answer */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 rounded-3xl shadow-2xl border-4 border-blue-300/40 text-white flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/25 rounded-xl backdrop-blur-sm border border-white/40">
                  <LightBulbIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-white text-sm font-medium inline">
                  Answer
                </span>
              </div>

              {isReviewCard ? (
                <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40">
                  Review
                </div>
              ) : (
                <div className="text-white text-xs sm:text-sm font-bold bg-white/25 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm border border-white/40">
                  {currentIndex + 1} / {totalCards}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 max-h-96 flex items-center justify-center px-2 pl-4">
              <HtmlRenderer
                className="max-w-full !text-sm sm:!text-xl leading-relaxed"
                htmlContent={currentFlashcard.answer}
              />
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
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-800 dark:via-slate-800 dark:to-indigo-900 shadow-2xl border-2 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          <div className="relative z-10 text-center py-16 px-8">
            <div className="p-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-lg inline-block mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No matching cards found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clear the search to see all cards
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Flashcard;
