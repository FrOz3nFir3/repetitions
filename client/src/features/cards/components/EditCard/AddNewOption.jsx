import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { modifyCard } from "../../state/cardSlice";
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import RichTextEditor from "../../../../components/ui/RichTextEditor";

const AddNewOption = ({ cardId, flashcardId, quiz }) => {
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();
  const [newOption, setNewOption] = useState("");
  const editorRef = useRef(null);

  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOption) return;

    const updateDetails = {
      _id: cardId,
      cardId: flashcardId,
      quizId: quiz.quizId,
      option: newOption,
    };
    updateCard(updateDetails).then((res) => {
      if (res.data) {
        
        handleCancel();
      }
    });
  };

  const handleCancel = () => {
    setNewOption("");
    editorRef.current?.clearContent();
  };

  // sanitization and empty input is handled in backend
  const isInputEmpty = !newOption;

  return (
    <div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md mb-2">
          {error?.data?.error}
        </div>
      )}
      <p className="font-semibold text-gray-500 dark:text-gray-300 text-sm mb-1">
        Add New Option
      </p>
      <form onSubmit={handleAddOption} className="space-y-2">
        <RichTextEditor
          ref={editorRef}
          initialContent={newOption}
          onChange={setNewOption}
          editable={!isLoading}
        />
        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            disabled={isInputEmpty || isLoading}
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
    </div>
  );
};

export default AddNewOption;
