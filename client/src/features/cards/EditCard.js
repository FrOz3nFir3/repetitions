import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentCard } from './cardSlice';
import { NewFlashcard } from './NewFlashcard';
import FlashcardList from './FlashcardList';

const EditCard = () => {
  const card = useSelector(selectCurrentCard);

  if (!card) {
    return null; // Or a loading state
  }

  const { _id, review = [] } = card;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Flashcards ({review.length})</h2>
        <NewFlashcard _id={_id} />
      </div>
      <FlashcardList flashcards={review} cardId={_id} />
    </div>
  );
};

export default EditCard;
