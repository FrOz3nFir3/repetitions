import React, { useState, useRef } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "../../state/cardSlice";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "../../../../components/ui/Modal";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

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
        // dispatch(modifyCard(updateDetails));
        setIsOpen(false);
        setQuestion("");
        setAnswer("");
      }
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="shrink-0 cursor-pointer inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 "
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add Review
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-1">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                <DocumentPlusIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Add a New Flashcard
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create a new flashcard with a front (question) and back
                  (answer).
                </p>
              </div>
            </div>
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
              disabled={isLoading || !question || !answer}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Add Review"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
