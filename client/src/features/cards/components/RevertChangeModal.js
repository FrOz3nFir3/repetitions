import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePatchUpdateCardMutation } from "../../../api/apiSlice";
import { selectCurrentCard } from "../state/cardSlice";
import Modal from "../../../components/ui/Modal";
import RichTextEditor from "../../../components/ui/RichTextEditor";
import { ArrowUturnLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const RevertChangeModal = ({ isOpen, onClose, change }) => {
  const errorRef = React.useRef(null);
  const card = useSelector(selectCurrentCard);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();

  const handleRevert = () => {
    const { field, oldValue, cardId, quizId, optionId } = change;
    let updateDetails = { _id: card._id, cardId, reverted: true };

    switch (field) {
      case "Flashcard Question":
        updateDetails.question = oldValue;
        break;
      case "Flashcard Answer":
        updateDetails.answer = oldValue;
        break;
      case "Quiz Question":
        updateDetails.quizId = quizId;
        updateDetails.quizQuestion = oldValue;
        break;
      case "Quiz Answer":
        updateDetails.quizId = quizId;
        updateDetails.quizAnswer = oldValue;
        break;
      case "Quiz Minimum Options":
        updateDetails.quizId = quizId;
        updateDetails.minimumOptions = Number(oldValue);
        break;
      case "Category":
        updateDetails.category = oldValue;
        break;
      case "Main Topic":
        updateDetails["main-topic"] = oldValue;
        break;
      case "Sub Topic":
        updateDetails["sub-topic"] = oldValue;
        break;
      case "Description":
        updateDetails.description = oldValue;
        break;
      default:
        if (field.startsWith("Quiz Option")) {
          updateDetails.quizId = quizId;
          updateDetails.optionId = optionId;
          updateDetails.option = oldValue;
        }
        break;
    }

    updateCard(updateDetails).then((response) => {
      if (response.data) {
        onClose();
      }
    });
  };

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  return (
    <Modal
      maxWidth="7xl"
      isOpen={isOpen}
      onClose={onClose}
      title="Revert Change"
      className={`!bg-gray-50 dark:!bg-gray-800 rounded-lg`}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:!text-white">
          Confirm Revert
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          You are about to revert the following change. Both are read only
          fields.
        </p>
      </div>

      <div
        ref={errorRef}
        className="my-4 transition-opacity duration-300 ease-in-out"
      >
        {error && (
          <div className="rounded-md bg-red-100 dark:bg-red-900 p-4 text-sm text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700">
            {error.data?.error || "An error occurred while reverting changes."}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
          {change.field}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Before
            </p>
            <div>
              <RichTextEditor
                initialContent={change.newValue}
                editable={false}
              />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
              After
            </p>
            <div>
              <RichTextEditor
                initialContent={change.oldValue}
                editable={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="cursor-pointer flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 transition-colors duration-200"
        >
          <XMarkIcon className="mr-2 h-5 w-5" />
          Cancel
        </button>
        <button
          onClick={handleRevert}
          disabled={isLoading}
          className="cursor-pointer flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ArrowUturnLeftIcon className="mr-2 h-5 w-5" />
              Revert
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default RevertChangeModal;
