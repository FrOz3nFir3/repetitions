import React from "react";
import FlashcardItem from "./FlashcardItem"; // Import the new, clean component

const FlashcardList = ({ flashcards, cardId }) => {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-10 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No flashcards yet!
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Click "Add New Flashcard" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
      {flashcards.map((flashcard, index) => (
        <FlashcardItem
          key={flashcard._id || index}
          flashcard={flashcard}
          cardId={cardId}
        />
      ))}
    </div>
  );
};

export default FlashcardList;
