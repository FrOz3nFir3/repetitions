import React from "react";
import { FlashcardArray } from "react-quizlet-flashcard";
import { NewFlashcard } from "../cards/NewFlashcard";
import { CardField } from "../cards/CardField";
import { useOutletContext } from "react-router-dom";
import { useButtonToggle } from "../../hooks/buttonToggle";
import { BiEdit, BiXCircle } from "react-icons/bi";
import {useSelector} from "react-redux";
import {selectCurrentCard} from "../cards/cardSlice";

export function Review() {
  const [cardId, changeCardId] = React.useState(1);
  const [editFlashCard, toggleEditFlashCard] = useButtonToggle();

  const card = useSelector(selectCurrentCard);
  const { _id, review=[] } = card;
  const cards = review.map((card) => ({
    id: card.cardId,
    front: card.question,
    back: card.answer,
  }));

  return (
    <div className="review-container">
      {cards.length > 0 ? (
        <>
          <FlashcardArray cards={cards} onCardChange={changeCardId} />

          <h2 className="align-svg bg-blue-france">
            Flashcard{" "}
            {editFlashCard ? (
              <BiXCircle size={30} onClick={toggleEditFlashCard} />
            ) : (
              <BiEdit size={30} onClick={toggleEditFlashCard} />
            )}
          </h2>
          {editFlashCard ? (
            <div className="flow-content">
              <CardField
                _id={_id}
                text="question"
                value={cards[cardId - 1].front}
                cardId={cardId}
              />
              <CardField
                _id={_id}
                text="answer"
                value={cards[cardId - 1].back}
                cardId={cardId}
              />
            </div>
          ) : null}
        </>
      ) : null}
      <NewFlashcard _id={_id} />
    </div>
  );
}
