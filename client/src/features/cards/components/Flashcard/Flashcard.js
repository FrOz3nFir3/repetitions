import React, { useState } from "react";
import PropTypes from "prop-types";

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard" onClick={handleFlip}>
      <div className={`flashcard-inner ${isFlipped ? "is-flipped" : ""}`}>
        <div className="flashcard-front">
          <p>{front}</p>
        </div>
        <div className="flashcard-back">
          <p>{back}</p>
        </div>
      </div>
    </div>
  );
};

Flashcard.propTypes = {
  front: PropTypes.string.isRequired,
  back: PropTypes.string.isRequired,
};

const FlashcardArray = ({ cards, onCardChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % cards.length;
    setCurrentIndex(newIndex);
    if (onCardChange) {
      onCardChange(cards[newIndex].id);
    }
  };

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + cards.length) % cards.length;
    setCurrentIndex(newIndex);
    if (onCardChange) {
      onCardChange(cards[newIndex].id);
    }
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <div className="flashcard-array">
      <Flashcard
        front={cards[currentIndex].front}
        back={cards[currentIndex].back}
      />
      <div className="flashcard-navigation">
        <button className="arrow-btn" onClick={handlePrev}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span>
          {currentIndex + 1} / {cards.length}
        </span>
        <button className="arrow-btn" onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

FlashcardArray.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      front: PropTypes.string.isRequired,
      back: PropTypes.string.isRequired,
    })
  ).isRequired,
  onCardChange: PropTypes.func,
};

export { Flashcard, FlashcardArray };
