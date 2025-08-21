import React, { useState, useEffect } from "react";
import { usePatchUpdateCardMutation } from "../../../api/apiSlice";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "../../../components/ui/RichTextEditor";
import HtmlRenderer from "../../../components/ui/HtmlRenderer";
import Flashcard from "./Flashcard/Review/Flashcard";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useSelector } from "react-redux";

export function CardField({
  _id,
  text,
  value,
  cardId,
  quizId,
  optionId,
  showFlashcardPreview,
  flashcardData,
}) {
  const user = useSelector(selectCurrentUser);
  const errorRef = React.useRef(null);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [previewData, setPreviewData] = useState(flashcardData);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (showFlashcardPreview) {
      setPreviewData((prev) => ({ ...prev, [text]: inputValue }));
    }
  }, [inputValue, text, showFlashcardPreview]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleValueChange = (newContent) => {
    setInputValue(newContent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updateDetails = { _id, [text]: inputValue, cardId, quizId, optionId };

    updateCard(updateDetails).then((response) => {
      if (response.data) {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (text === "answer") {
      setIsFlipped(true);
    } else {
      setIsFlipped(false);
    }
  };

  const isUnchanged = inputValue === value;
  const isRichTextField =
    text === "question" ||
    text === "answer" ||
    text === "option" ||
    text === "description";

  return (
    <div className="card-field group relative">
      {/* Field label is now handled by parent FieldCard component */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div ref={errorRef}>
            {error && (
              <div className="my-4 rounded-md bg-red-100 dark:bg-red-900 p-4 text-sm text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700">
                Update failed: {error.data?.error || "Unknown error"}
              </div>
            )}
          </div>

          {isRichTextField ? (
            <RichTextEditor
              initialContent={inputValue}
              onChange={handleValueChange}
              editable={!isLoading}
            />
          ) : (
            <input
              type={text === "minimumOptions" ? "number" : "text"}
              value={inputValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="bg-white dark:bg-gray-700 dark:text-white block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 h-10"
              min={text === "minimumOptions" ? 2 : undefined}
              max={text === "minimumOptions" ? 4 : undefined}
              required
              disabled={isLoading}
            />
          )}
          {showFlashcardPreview && (
            <div className="mt-4 ">
              <h4 className="text-md font-bold text-gray-700 dark:text-white mb-2">
                Live Preview
              </h4>
              <Flashcard
                currentFlashcard={previewData}
                isFlipped={isFlipped}
                setIsFlipped={() => {}}
                viewOnly
              />
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
            {!user && "Login in to edit"}
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="submit"
              disabled={isUnchanged || isLoading || !user}
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
        <div className="flex items-start justify-between group">
          <div className="flex-1 min-w-0 pr-4">
            {isRichTextField ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <HtmlRenderer htmlContent={value} />
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                  {value || (
                    <span className="text-gray-400 italic">No value set</span>
                  )}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleEditClick}
            className="flex-shrink-0 cursor-pointer opacity-100 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
