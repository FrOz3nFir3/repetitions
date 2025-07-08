import React from "react";
import { CardField } from "./CardField";
import { usePatchUpdateCardMutation } from "../../api/apiSlice";
import { TrashIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { modifyCard } from "./cardSlice";

const FlashcardList = ({ flashcards, cardId }) => {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-10 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          No flashcards yet!
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Click "Add New Flashcard" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 border-t border-gray-200 pt-6">
      {flashcards.map((flashcard, index) => (
        <FlashcardItem
          key={flashcard._id || index}
          flashcard={flashcard}
          cardId={cardId}
          flashcardIndex={index}
        />
      ))}
    </div>
  );
};

const FlashcardItem = ({ flashcard, cardId, flashcardIndex }) => {
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();
  const newOptionRef = React.useRef();

  const handleDeleteFlashcard = () => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcard.cardId,
      deleteCard: true,
    };
    updateCard(updateDetails).then((response) => {
      if (response.data) {
        dispatch(modifyCard(updateDetails));
      }
    });
  };

  const handleAddOption = (e) => {
    e.preventDefault();
    const option = newOptionRef.current.value;
    if (!option) return;

    const updateDetails = { _id: cardId, cardId: flashcard.cardId, option };
    updateCard(updateDetails).then((res) => {
      if (res.data) {
        dispatch(modifyCard(updateDetails));
        newOptionRef.current.value = "";
      }
    });
  };

  const handleDeleteOption = (optionIndex) => {
    const updateDetails = {
      _id: cardId,
      cardId: flashcard.cardId,
      optionIndex,
      deleteOption: true,
    };
    updateCard(updateDetails).then((res) => {
      if (res.data) {
        dispatch(modifyCard(updateDetails));
      }
    });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error.data.error}
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className="w-full">
          <CardField
            _id={cardId}
            text="question"
            value={flashcard.question}
            cardId={flashcard.cardId}
          />
          <div className="mt-2 border-t pt-2">
            <CardField
              _id={cardId}
              text="answer"
              value={flashcard.answer}
              cardId={flashcard.cardId}
            />
          </div>
        </div>
        <button
          onClick={handleDeleteFlashcard}
          className="cursor-pointer ml-4 text-red-500 hover:text-red-700 flex-shrink-0"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Quiz Options Management */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">
          Quiz Options
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardField
            _id={cardId}
            text="minimumOptions"
            value={flashcard.minimumOptions}
            cardId={flashcard.cardId}
          />
          <div className="space-y-2">
            {flashcard.options.map((option, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white p-2 rounded-md border"
              >
                <div className="flex-grow">
                  <CardField
                    _id={cardId}
                    text="option"
                    value={option}
                    cardId={flashcard.cardId}
                    optionIndex={i}
                  />
                </div>
                {/* TODO: implement this later */}
                {/* <button onClick={() => handleDeleteOption(i)} className="ml-2 text-red-400 hover:text-red-600">
                            <TrashIcon className="h-5 w-5" />
                        </button> */}
              </div>
            ))}
            {flashcard.options.length < flashcard.minimumOptions && (
              <form
                onSubmit={handleAddOption}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  ref={newOptionRef}
                  placeholder="Add new option"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-10 bg-white"
                />
                <button
                  type="submit"
                  className="cursor-pointer p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
                >
                  <PlusCircleIcon className="h-6 w-6" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;
