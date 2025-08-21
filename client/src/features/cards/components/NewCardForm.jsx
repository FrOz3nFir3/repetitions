import React, { useState, useRef } from "react";
import { usePostCreateNewCardMutation } from "../../../api/apiSlice";
import {
  PlusIcon,
  ArrowPathIcon,
  TagIcon,
  FolderIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";
import Modal from "../../../components/ui/Modal";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";

const FormField = ({ icon: Icon, title, children, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-600 border-blue-200 dark:border-blue-700",
    green:
      "from-green-500 to-emerald-600 border-green-200 dark:border-green-700",
    orange:
      "from-orange-500 to-amber-600 border-orange-200 dark:border-orange-700",
    purple:
      "from-purple-500 to-violet-600 border-purple-200 dark:border-purple-700",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 ${colorClasses[color]} transition-all duration-300 group`}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="ml-1">{children}</div>
      </div>
    </div>
  );
};

export function NewCardForm({ category, newCard }) {
  const [isOpen, setIsOpen] = useState(newCard);
  const user = useSelector(selectCurrentUser);
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
        className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <PlusIcon className="-ml-0.5 h-5 w-5" />
        New Card
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="4xl"
        className="!bg-gradient-to-br !from-gray-50 !to-blue-50 dark:!from-gray-900 dark:!to-gray-800"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg mb-4">
              <DocumentPlusIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Create New Card
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Build a new flashcard with topic and category information
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-4 flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium text-sm">
                  Creation Failed
                </p>
                <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                  {error.data?.error ||
                    "An error occurred while creating the card"}
                </p>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            <FormField icon={FolderIcon} title="Category" color="orange">
              <div className="bg-gray-200 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-white font-medium">
                  {category}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This card will be created in this category
                </p>
              </div>
            </FormField>

            <FormField icon={HashtagIcon} title="Main Topic" color="blue">
              <input
                type="text"
                id="topic"
                ref={topicRef}
                required
                disabled={isLoading}
                placeholder="Enter the main topic for this card..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </FormField>

            <FormField icon={TagIcon} title="Sub Topic" color="green">
              <input
                type="text"
                id="sub-topic"
                ref={subTopicRef}
                required
                disabled={isLoading}
                placeholder="Enter the sub-topic for this card..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              />
            </FormField>
          </div>

          {/* Action Button */}
          <div className="pt-6  flex flex-wrap gap-4 items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 ">
              {!user && "Login in to Create"}
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 ">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 transition-all duration-200 font-medium"
              >
                <XMarkIcon className="h-5 w-5" />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading || !user}
                className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 transition-all duration-200 group"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                )}
                {isLoading ? "Creating Card..." : "Create New Card"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
