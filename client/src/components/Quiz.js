import React, { useCallback } from "react";
import {usePatchUpdateCardMutation, usePatchUpdateUserMutation} from "../slice/apiSlice";
import { NewFlashcard } from "./NewFlashcard";
import { CardField } from "./CardField";
import { useOutletContext } from "react-router-dom";
import { useButtonToggle } from "../hooks/buttonToggle";
import { BiEdit, BiXCircle } from "react-icons/bi";
import Loading from "./Loading";
import {useDispatch, useSelector} from "react-redux";
import {modifyUser, selectCurrentUser} from "../slice/authSlice";
import {modifyCard, selectCurrentCard} from "../slice/cardSlice";

export function Quiz() {
  const [correctOption = "", changeOption] = React.useState(undefined);
  const [autoNext, toggleAutoNext] = useButtonToggle();
  const autoNextCardRef = React.useRef();

  React.useEffect(() => {
    if (autoNext && correctOption && cardNo < review.length) {
      autoNextCardRef.current = setTimeout(() => {
        nextCard();
      }, 1000);
    }

    return () => {
      window.clearTimeout(autoNextCardRef.current);
    };
  }, [correctOption]);

  const [cardNo, changeCard] = React.useState(1);
  const cards = useSelector(selectCurrentCard);
  const { _id, review = [] } = cards;

  const totalCards = review.length;
  const card = review[cardNo - 1];

  const nextCard = () => {
    changeOption("");
    changeCard((cardNo) => {
      let atLastCard = cardNo == totalCards;
      if (atLastCard) {
        return cardNo;
      }
      return cardNo + 1;
    });
  };

  return (
    <div className="quiz-container">
      <IndividualQuiz
        card={card}
        _id={_id}
        correctOption={correctOption}
        changeOption={changeOption}
        currentStatus={renderCurrentQuizStatus}
      />

      <NewFlashcard _id={_id} />
    </div>
  );

  function renderCurrentQuizStatus(updateUser, user) {


    if (totalCards == 0) {
      return null;
    }

    let cardsFinished = cardNo == review.length && correctOption;


    return (
      <div className="flex flex-center-all">
        <p>
          {cardNo}/{totalCards}
        </p>
        {cardsFinished ? (
          <h2>Congrats you just finished</h2>
        ) : (
          <>
            <button className="btn bg-blue-france" onClick={nextCard}>
              Next
            </button>
            {autoNext ? (
              <button className="btn bg-blue-france" onClick={toggleAutoNext}>
                Turn Off Auto Next
              </button>
            ) : (
              <button className="btn" onClick={toggleAutoNext}>
                Turn On Auto Next
              </button>
            )}
          </>
        )}
      </div>
    );
  }
}

function IndividualQuiz(props) {
  const dispatch = useDispatch()
  const newOptionRef = React.useRef();
  const [editOptions, toggleOptions] = useButtonToggle();
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const [updateUser, ] = usePatchUpdateUserMutation();
  const user =  useSelector(selectCurrentUser)

  const { _id, card, correctOption, changeOption, currentStatus } = props;
  if (card == null) return null;

  const { cardId: id, question, answer, minimumOptions, options } = card;

  const changeSelectedOption = (event) => {
    let selectedOption = event.target;
    if (selectedOption.innerText == answer) {
      changeOption(true);
      selectedOption.classList.add("border-green");
      if(user != null){
        let updateDetails = {card_id:_id, email:user.email, type:"total-correct"};
        updateUser(updateDetails)
          .then((response)=>{
            if(response.data){
              dispatch(modifyUser(updateDetails))
            }
          })
      }

    } else {
      if(user != null){
        let updateDetails = {card_id:_id, email:user.email, type:"total-incorrect"};
        updateUser(updateDetails)
          .then((response)=>{
            if(response.data){
              dispatch(modifyUser(updateDetails))
            }
          })
      }
      changeOption(false);
      selectedOption.disabled = true;
      selectedOption.classList.add("border-red");
    }
  };

  const addNewOption = (event) => {
    event.preventDefault();
    const option = newOptionRef.current.value;
    const cardId = id;
    const updateDetails = { _id, cardId, option};

    updateCard(updateDetails)
      .then((response)=> {
        if(response.data){
        dispatch(modifyCard(updateDetails))
       }
      });
  };

  if(isLoading){
    return <Loading/>
  }

  return (
    <>
      {typeof correctOption == "boolean" ? (
        correctOption ? (
          <p>Correct!</p>
        ) : (
          <p>Incorrect!</p>
        )
      ) : null}
      <h2>{question}</h2>
      <ul className="quiz-options">{options.map(createOptions)}</ul>

      {options.length < minimumOptions ? (
        <form className="new-option" onSubmit={addNewOption}>
          <input type="text" ref={newOptionRef} required />
          <input
            className="btn bg-blue-france"
            type="submit"
            value="Add Option"
          />
        </form>
      ) : null}

      {currentStatus.call(null, updateUser, user)}

      <div className="flow-content">
        <CardField
          _id={_id}
          text="minimumOptions"
          value={minimumOptions}
          cardId={id}
        />
        <h2 className="align-svg bg-blue-france">
          Options
          {editOptions ? (
            <BiXCircle size={30} onClick={toggleOptions} />
          ) : (
            <BiEdit size={30} onClick={toggleOptions} />
          )}
        </h2>
        <div className="flex-col">
          {editOptions ? options.map(optionsField) : null}
        </div>
      </div>
    </>
  );

  // hositing
  function createOptions(value, index) {
    return (
      <li key={value} onClick={changeSelectedOption}>
        {value}
      </li>
    );
  }
  function optionsField(value, index) {
    return (
      <CardField
        key={`${value}-${index}`}
        _id={_id}
        text="option"
        value={value}
        optionIndex={index}
        cardId={id}
      />
    );
  }
}
