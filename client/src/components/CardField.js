import { usePatchUpdateCardMutation } from "../slice/apiSlice";
import { useButtonToggle } from "../hooks/buttonToggle";
import React from "react";
import Loading from "./Loading";
import { BiCheckSquare, BiEdit, BiXCircle } from "react-icons/bi";
import {modifyCard} from "../slice/cardSlice";
import {useDispatch} from "react-redux";

export function CardField(props) {
  var { _id, text, value, cardId, optionIndex } = props;
  const dispatch = useDispatch()
  const [updateCard, { isLoading,isSuccess , error }] = usePatchUpdateCardMutation();

  const [buttonClicked, toggleButton] = useButtonToggle();
  const [inputValue = "", changeValue] = React.useState(value);

  React.useEffect(() => {
    changeValue(value);
  }, [value]);

  const changeInputValue = (event) => {
    changeValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toggleButton();
    let updateDetails = { _id, [text]: inputValue };
    if (cardId) {
      updateDetails.cardId = cardId;
    }
    if (typeof optionIndex == "number") {
      updateDetails.optionIndex = optionIndex;
    }
    updateCard(updateDetails)
      .then((response)=> {
        if(response.data){
          dispatch(modifyCard(updateDetails))
        }
      })
  };


  if (isLoading) {
    return <Loading count={5} />;
  }
  return (
    <div className="card-field">
      {error && <div className="bg-error">{error.data.error}</div>}
      <h2 className="field-edit align-svg">
        {text}
        {buttonClicked ? (
          <BiXCircle onClick={toggleButton} size={30} />
        ) : (
          <BiEdit onClick={toggleButton} size={30} />
        )}
      </h2>
      <>
        {buttonClicked ? (
          <form className="align-svg" onSubmit={handleSubmit}>
            {text == "minimumOptions" ? (
              <input
                type="number"
                value={inputValue}
                onChange={changeInputValue}
                min={2}
                max={4}
                required
              />
            ) : (
              text == "question" || text == "answer" ? (
                <textarea
                  type="text"
                  value={inputValue}
                  onChange={changeInputValue}
                  required
                />
                ) :
                <input
                  type="text"
                  value={inputValue}
                  onChange={changeInputValue}
                  required
                />

            )}
            <BiCheckSquare size={40} onClick={handleSubmit} />
          </form>
        ) : text == "question" || text == "answer" ? null : (
          <h2>{value}</h2>
        )}
      </>
    </div>
  );
}
