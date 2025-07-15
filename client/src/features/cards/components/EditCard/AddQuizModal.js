import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Modal from "../../../../components/ui/Modal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { modifyCard } from "../../state/cardSlice";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const AddQuizModal = ({ isOpen, onClose, cardId, flashcardId }) => {
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [updateCard, { error, isLoading }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();
  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateDetails = {
      _id: cardId,
      cardId: flashcardId,
      quizQuestion,
      quizAnswer,
    };
    updateCard(updateDetails).then((response) => {
      if (response.data) {
        // dispatch(modifyCard(updateDetails));
        onClose();
      }
    });
  };

  const isInputEmpty =
    !quizQuestion ||
    quizQuestion.replace(/<(.|\n)*?>/g, "").trim().length === 0 ||
    !quizAnswer ||
    quizAnswer.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Quiz">
      <div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          Add a New Quiz
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Create a new quiz with a question and answer. You can add more options
          after creating it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error.data.error}
          </div>
        )}
        <div>
          <label
            onClick={() => questionEditorRef.current?.focus()}
            className="cursor-pointer block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Question
          </label>
          <RichTextEditor
            ref={questionEditorRef}
            initialContent={quizQuestion}
            onChange={setQuizQuestion}
            editable={!isLoading}
          />
        </div>
        <div>
          <label
            onClick={() => answerEditorRef.current?.focus()}
            className="cursor-pointer block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Answer
          </label>
          <RichTextEditor
            ref={answerEditorRef}
            initialContent={quizAnswer}
            onChange={setQuizAnswer}
            editable={!isLoading}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isInputEmpty || isLoading}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              "Add Quiz"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddQuizModal;
