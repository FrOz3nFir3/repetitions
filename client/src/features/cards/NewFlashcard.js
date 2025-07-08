import React, { useState, useRef } from "react";
import { usePatchUpdateCardMutation } from "../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "./cardSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";

export function NewFlashcard({ _id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const dispatch = useDispatch();

  const questionRef = useRef();
  const answerRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const question = questionRef.current.value;
    const answer = answerRef.current.value;
    const updateDetails = { _id, question, answer };

    updateCard(updateDetails).then((response) => {
      if (response.data) {
        dispatch(modifyCard(updateDetails));
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-x-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add New Flashcard
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Add a New Flashcard
            </h3>
            <p className="mt-1 text-sm text-gray-500">
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
              htmlFor="question"
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
            <textarea
              id="question"
              ref={questionRef}
              rows={3}
              required
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700"
            >
              Answer
            </label>
            <textarea
              id="answer"
              ref={answerRef}
              rows={3}
              required
              className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? <Loading /> : "Add Flashcard"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
