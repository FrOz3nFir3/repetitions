import React from "react";
import { NewFlashcard } from "./NewFlashCardForm";

const EditCardHeader = ({ totalFlashcards, flashcardId }) => (
  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Edit Flashcards
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Total flashcards in this deck: {totalFlashcards}
      </p>
    </div>
    <NewFlashcard flashcardId={flashcardId} />
  </div>
);

export default EditCardHeader;
