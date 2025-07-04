import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectCurrentCard } from "../cards/cardSlice";
import { ChevronLeftIcon, ChevronRightIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

export function Review() {
  const card = useSelector(selectCurrentCard);
  const { review = [] } = card;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % review.length);
  }, [review.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + review.length) % review.length);
  }, [review.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev]);

  if (review.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-900">No flashcards to review!</h3>
        <p className="mt-1 text-sm text-gray-500">Add some flashcards to get started.</p>
      </div>
    );
  }

  const currentFlashcard = review[currentIndex];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Review Session</h2>
        <p className="mt-2 text-md text-gray-600">Click the card to flip it and reveal the answer.</p>
      </div>
      <div className="flex items-center justify-center">
        <div 
          className="w-full max-w-xl h-80"
          style={{ perspective: '1000px' }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className="relative w-full h-full transition-transform duration-700"
            style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front of the card */}
            <div className="absolute w-full h-full flex items-center justify-center p-6 bg-indigo-500 rounded-lg shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-2xl text-white text-center">{currentFlashcard.question}</p>
            </div>
            {/* Back of the card */}
            <div className="absolute w-full h-full flex items-center justify-center p-6 bg-green-500 rounded-lg shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="text-2xl text-white text-center">{currentFlashcard.answer}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 max-w-xl mx-auto">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <p className="text-lg font-semibold text-gray-700">
          {currentIndex + 1} / {review.length}
        </p>
        <button
          onClick={handleNext}
          className="flex items-center justify-center p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <div className="text-center text-gray-500 mt-4 text-sm flex items-center justify-center">
        <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
        Use Left/Right arrow keys to navigate
      </div>
    </div>
  );
}