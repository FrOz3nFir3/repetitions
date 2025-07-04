import { usePatchUpdateCardMutation } from "../../api/apiSlice";
import { useButtonToggle } from "../../hooks/buttonToggle";
import React from "react";
import {modifyCard} from "./cardSlice";
import {useDispatch} from "react-redux";

export function NewFlashcard(props) {
  const { _id } = props;
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch()

  const [buttonClicked, toggleButton] = useButtonToggle();
  const questionRef = React.useRef();
  const answerRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const question = questionRef.current.value;
    const answer = answerRef.current.value;

    const updateDetails = {_id, question, answer};

    updateCard(updateDetails)
      .then((response)=> {
        if(response.data){
          dispatch(modifyCard(updateDetails))
        }
      })
  };

  return (
    <>
      {error && <div className="bg-error">{error.data.error}</div>}

      <button className="btn" onClick={toggleButton}>
        {buttonClicked ? "Close" : "Add New Flashcard"}
      </button>
      {buttonClicked ? (
        <form className="add-card flow-content" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="question">Question</label>
            <input type="text" id="question" ref={questionRef} required />
          </div>

          <div>
            <label htmlFor="answer">Answer</label>
            <input type="text" id="answer" ref={answerRef} required />
          </div>

          <input
            className="btn bg-blue-france"
            type="submit"
            value="Add New Flashcard"
          />
        </form>
      ) : null}
    </>
  );
}
