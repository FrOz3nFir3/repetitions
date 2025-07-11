import React, { useState, useRef } from "react";
import { usePostCreateNewCardMutation } from "../../../api/apiSlice";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Modal from "../../../components/ui/Modal";

export function NewCardForm({ category, newCard }) {
  const [isOpen, setIsOpen] = useState(newCard);
  const [createNewCard, { isLoading, error, isSuccess }] =
    usePostCreateNewCardMutation();

  const topicRef = useRef(null);
  const subTopicRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mainTopic = topicRef.current.value;
    const subTopic = subTopicRef.current.value;
    createNewCard({ mainTopic, subTopic, category });
  };

  React.useEffect(() => {
    if (!open || !isSuccess) return;
    setIsOpen(false);
  }, [open, isSuccess]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-2 sm:px-4 py-2 text-xs sm:text-sm  font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add New Card
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create a New Card
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This will create a new card with a main topic and a sub-topic.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              {error.data.error}
            </div>
          )}

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              disabled
              className="block w-full mt-1 rounded-md bg-gray-100 dark:bg-gray-700 sm:text-sm border-gray-300 dark:border-gray-600 shadow-sm p-2 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Main Topic
            </label>
            <input
              type="text"
              id="topic"
              ref={topicRef}
              required
              disabled={isLoading}
              className="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="sub-topic"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sub-Topic
            </label>
            <input
              type="text"
              id="sub-topic"
              ref={subTopicRef}
              required
              disabled={isLoading}
              className="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-600"
            />
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Create Card"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
