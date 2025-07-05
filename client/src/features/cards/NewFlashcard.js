import React, { useState, useRef } from "react";
import { usePatchUpdateCardMutation } from "../../api/apiSlice";
import { useDispatch } from "react-redux";
import { modifyCard } from "./cardSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/common/Loading";

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

      {isOpen && (
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Add a New Flashcard</h3>
                {error && <div className="rounded-md bg-red-50 p-4 text-red-700">{error.data.error}</div>}

                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                    Question
                  </label>
                  <textarea
                    id="question"
                    ref={questionRef}
                    rows={3}
                    required
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                    Answer
                  </label>
                  <textarea
                    id="answer"
                    ref={answerRef}
                    rows={3}
                    required
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}