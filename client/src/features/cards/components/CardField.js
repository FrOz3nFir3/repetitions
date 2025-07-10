import React, { useState, useEffect } from "react";
import { usePatchUpdateCardMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "../state/cardSlice";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Loading from "../../../components/ui/Loading";

export function CardField({ _id, text, value, cardId, optionIndex }) {
  const dispatch = useDispatch();
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsEditing(false);
    const updateDetails = { _id, [text]: inputValue };
    if (cardId) {
      updateDetails.cardId = cardId;
    }
    if (typeof optionIndex === "number") {
      updateDetails.optionIndex = optionIndex;
    }
    updateCard(updateDetails).then((response) => {
      if (response.data) {
        dispatch(modifyCard(updateDetails));
      }
    });
  };

  const isTextArea =
    text === "question" || text === "answer" || text === "description";

  return (
    <div className="card-field group relative py-1">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          {error.data.error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-semibold text-gray-500 dark:text-gray-300 text-sm capitalize">
            {text.replace("-", " ")}
          </p>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              {isTextArea ? (
                <textarea
                  value={inputValue}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-600 dark:text-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-24"
                  rows={text === "description" ? 3 : 2}
                  required
                />
              ) : (
                <input
                  type={text === "minimumOptions" ? "number" : "text"}
                  value={inputValue}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-600 dark:text-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-10"
                  min={text === "minimumOptions" ? 2 : undefined}
                  max={text === "minimumOptions" ? 4 : undefined}
                  required
                />
              )}
              <button
                type="submit"
                className="cursor-pointer text-green-500 hover:text-green-700"
              >
                <CheckIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cursor-pointer text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {value}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-gray-500 dark:text-white hover:text-indigo-600"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {isLoading && <Loading count={1} />}
    </div>
  );
}
