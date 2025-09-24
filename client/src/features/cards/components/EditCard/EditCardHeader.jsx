import React from "react";
import { NewFlashcardModal } from "./NewFlashCardModal";
import AddQuizModal from "./AddQuizModal";

const EditCardHeader = ({ flashcardId, view }) => (
  <div className="flex gap-2 flex-wrap justify-between items-center mb-4">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Edit {view}
      </h2>
    </div>
    <div className="flex items-center">
      {view === "flashcards" ? (
        <NewFlashcardModal flashcardId={flashcardId} />
      ) : (
        <AddQuizModal cardId={flashcardId}  />
      )}
    </div>
  </div>
);

export default EditCardHeader;
