import React, { useState, useRef } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "../../state/cardSlice";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "../../../../components/ui/Modal";
import RichTextEditor from "../../../../components/ui/RichTextEditor";

export function NewFlashcard({ flashcardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updateDetails = { _id: flashcardId, question, answer };

    updateCard(updateDetails).then((response) => {
      if (response.data) {
        dispatch(modifyCard(updateDetails));
        setIsOpen(false);
        setQuestion("");
        setAnswer("");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer inline-flex items-center gap-x-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add New Flashcard
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add a New Flashcard
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a question and answer to create a new flashcard.
            </p>
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              {error.data.error}
            </div>
          )}

          <div>
            <label
              onClick={() => questionEditorRef.current?.focus()}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Question
            </label>
            <RichTextEditor
              ref={questionEditorRef}
              initialContent={question}
              onChange={setQuestion}
              editable={!isLoading}
            />
          </div>

          <div>
            <label
              onClick={() => answerEditorRef.current?.focus()}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              Answer
            </label>
            <RichTextEditor
              ref={answerEditorRef}
              initialContent={answer}
              onChange={setAnswer}
              editable={!isLoading}
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              disabled={isLoading || !question || !answer}
              className="cursor-pointer inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Add Flashcard"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
