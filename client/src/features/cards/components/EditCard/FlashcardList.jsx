import React from "react";
import FlashcardItem from "./FlashcardItem";
import { DocumentIcon } from "@heroicons/react/24/solid";

const FlashcardList = ({
  review,
  flashcard,
  cardId,
  currentIndex,
  originalFlashcardIndex,
}) => {
  if (!flashcard) {
    return (
      <div className="text-center py-20 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <DocumentIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            No flashcards found
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md">
            Try a different search term, or create a new flashcard to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <FlashcardItem
        review={review}
        flashcard={flashcard}
        cardId={cardId}
        currentIndex={currentIndex}
        originalIndex={originalFlashcardIndex}
      />
    </div>
  );
};

export default FlashcardList;
