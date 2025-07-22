import React from "react";
import { NewFlashcardModal } from "./NewFlashCardModal";
import AddQuizModal from "./AddQuizModal";

const EditCardHeader = ({ flashcardId, view, card }) => (
  <div className="flex gap-2 flex-wrap justify-between items-center mb-4">
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Edit {view}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {card?.["main-topic"]} / {card?.["sub-topic"]} / {card?.category}
      </p>
    </div>
    <div className="flex items-center">
      {view === "flashcards" ? (
        <NewFlashcardModal flashcardId={flashcardId} />
      ) : (
        <AddQuizModal cardId={flashcardId} flashcards={card.review} />
      )}
    </div>
  </div>
);

export default EditCardHeader;
