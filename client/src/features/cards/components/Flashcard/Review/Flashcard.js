import React from "react";
import HtmlRenderer from "../../../../../components/ui/HtmlRenderer";

const Flashcard = ({
  currentFlashcard,
  isFlipped,
  setIsFlipped,
  getSlideClass,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) => (
  <div
    className="flex items-center justify-center"
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    <div
      className={`w-full ${getSlideClass?.()}`}
      style={{ perspective: "1200px" }}
    >
      {currentFlashcard ? (
        <div
          className="h-96 relative w-full transition-transform duration-700 cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className="absolute w-full h-full p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-xl overflow-y-auto flex flex-col items-center justify-center text-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <HtmlRenderer
              className="max-w-full text-xl"
              htmlContent={currentFlashcard.question}
            />
          </div>
          <div
            className="absolute w-full h-full p-6 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg shadow-xl overflow-y-auto flex flex-col items-center justify-center text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <HtmlRenderer
              className="text-xl "
              htmlContent={currentFlashcard.answer}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            No matching cards found.
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            Clear the search to see all cards.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default Flashcard;
