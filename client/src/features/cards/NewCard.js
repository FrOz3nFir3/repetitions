import React, { useState, useRef } from "react";
import { usePostCreateNewCardMutation } from "../../api/apiSlice";
import Loading from "../../components/common/Loading";
import { PlusIcon } from "@heroicons/react/24/outline";

export function NewCard({ category, newCard }) {
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
    //
    if (!open || !isSuccess) return;
    setIsOpen(false);
  }, [open, isSuccess]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        Add New Card
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
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
                <h3 className="text-2xl font-bold text-gray-900">
                  Create a New Card
                </h3>
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-red-700">
                    {error.data.error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    disabled
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Main Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    ref={topicRef}
                    required
                    className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sub-topic"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sub-Topic
                  </label>
                  <input
                    type="text"
                    id="sub-topic"
                    ref={subTopicRef}
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
                    {isLoading ? <Loading /> : "Create Card"}
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
