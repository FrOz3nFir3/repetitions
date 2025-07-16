import React, { useState, useRef, useEffect } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "../../../../components/ui/Modal";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import Flashcard from "../Flashcard/Review/Flashcard";

export function NewFlashcard({ flashcardId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();
  const errorRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updateDetails = { _id: flashcardId, question, answer };

    updateCard(updateDetails).then((response) => {
      if (response.data) {
        setIsOpen(false);
        setQuestion("");
        setAnswer("");
        setIsFlipped(false);
      }
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const previewData = { question, answer };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="shrink-0 cursor-pointer inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 "
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add Review
      </button>

      <Modal isOpen={isOpen} onClose={onClose} maxWidth="7xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-start gap-4 mb-2">
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
          <div ref={errorRef}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error.data?.error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-4">
              <div>
                <label
                  onClick={() => questionEditorRef.current?.focus()}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Question
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 my-2">
                  This is the "front" of the card that the user will see first.
                </p>
                <RichTextEditor
                  ref={questionEditorRef}
                  initialContent={question}
                  onChange={(newContent) => {
                    setQuestion(newContent);
                    setIsFlipped(false);
                  }}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 my-2">
                  This is the "back" of the card, revealed as the answer.
                </p>
                <RichTextEditor
                  ref={answerEditorRef}
                  initialContent={answer}
                  onChange={(newContent) => {
                    setAnswer(newContent);
                    setIsFlipped(true);
                  }}
                  editable={!isLoading}
                />
              </div>
            </div>
            <div className="md:col-start-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Live Preview
              </label>
              <div className="mb-2 text-xs text-gray-500 dark:text-gray-300">
                Click on the card to flip it.
              </div>
              <div className="w-full h-full">
                <Flashcard
                  currentFlashcard={previewData}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
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
