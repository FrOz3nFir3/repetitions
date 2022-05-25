import { useButtonToggle } from "../hooks/buttonToggle";
import { usePostCreateNewCardMutation } from "../slice/apiSlice";
import React from "react";
import Loading from "./Loading";

export function NewCard(props) {
  const { newCard } = props;
  let { category = "" } = props;
  const [buttonClicked, toggleButton] = useButtonToggle();
  const [createNewCard, { isLoading, error }] = usePostCreateNewCardMutation();

  React.useEffect(() => {
    if (!buttonClicked && newCard) {
      toggleButton();
    }
  }, [category]);

  const topicRef = React.useRef(null);
  const subTopicRef = React.useRef(null);

  const handleSubmit = React.useCallback(function createNew(e) {
    e.preventDefault();
    let mainTopic = topicRef.current.value;
    let subTopic = subTopicRef.current.value;
    createNewCard({ mainTopic, subTopic, category });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {error && <div className="bg-error"> {error.data.error}</div>}
      <button
        className="btn bg-blue-capri"
        id="new-card"
        onClick={toggleButton}
      >
        {buttonClicked ? "Close" : "Add New Card"}
      </button>

      {buttonClicked && (
        <form className="add-card flow-content" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              required
              disabled
            />
          </div>

          <div>
            <label htmlFor="topic">Topic</label>
            <input type="text" id="topic" ref={topicRef} required />
          </div>

          <div>
            <label htmlFor="sub-topic">Sub-Topic</label>
            <input type="text" id="sub-topic" ref={subTopicRef} required />
          </div>

          <input
            className="btn bg-blue-france"
            type="submit"
            value="Create Card"
          />
        </form>
      )}
    </>
  );
}
