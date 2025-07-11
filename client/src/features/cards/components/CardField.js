import React, { useState, useEffect } from "react";
import { usePatchUpdateCardMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "../state/cardSlice";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export function CardField({ _id, text, value, cardId, optionIndex }) {
  const dispatch = useDispatch();
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Ensure internal state updates if the prop value changes from outside
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setInputValue(value); // Reset to original value
    setIsEditing(false);
  };

  const isUnchanged = inputValue === value;
  const isTextArea =
    text === "question" || text === "answer" || text === "description";

  return (
    <div className="card-field group relative py-2">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md mb-2">
          Update failed: {error.data?.error || "Unknown error"}
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
                  className="bg-white dark:bg-gray-700 dark:text-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  rows={text === "description" ? 4 : 3}
                  required
                  disabled={isLoading}
                />
              ) : (
                <input
                  type={text === "minimumOptions" ? "number" : "text"}
                  value={inputValue}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 dark:text-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-10"
                  min={text === "minimumOptions" ? 2 : undefined}
                  max={text === "minimumOptions" ? 4 : undefined}
                  required
                  disabled={isLoading}
                />
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUnchanged || isLoading}
                  className="cursor-pointer flex justify-center items-center h-8 w-8 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-800 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckIcon className="h-6 w-6" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="cursor-pointer flex justify-center items-center h-8 w-8 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between mt-1">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap pr-8">
                {value}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-2 right-0 cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 dark:text-gray-400 hover:text-indigo-600 p-1"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
