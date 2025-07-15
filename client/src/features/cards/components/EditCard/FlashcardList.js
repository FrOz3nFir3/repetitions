import React from "react";
import FlashcardItem from "./FlashcardItem";

const FlashcardList = ({ flashcard, cardId }) => {
  if (!flashcard) {
    return (
      <div className="text-center py-20 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          No flashcards found.
        </h3>
        <p className="mt-2 text-md text-gray-500 dark:text-gray-400">
          Try a different search term, or create a new flashcard to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <FlashcardItem flashcard={flashcard} cardId={cardId} />
    </div>
  );
};

export default FlashcardList;
