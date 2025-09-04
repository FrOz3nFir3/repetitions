import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePatchUpdateCardMutation } from "../../../api/apiSlice";
import { selectCurrentCard } from "../state/cardSlice";
import Modal from "../../../components/ui/Modal";
import RichTextEditor from "../../../components/ui/RichTextEditor";
import {
  ArrowUturnLeftIcon,
  XMarkIcon,
  UserCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { selectCurrentUser } from "../../authentication/state/authSlice";

const RevertChangeModal = ({ isOpen, onClose, change }) => {
  const errorRef = React.useRef(null);
  const card = useSelector(selectCurrentCard);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const user = useSelector(selectCurrentUser);

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
      case "Quiz Flashcard Association":
        updateDetails.quizId = quizId;
        updateDetails.cardId = change.cardId; // Reverting to the old flashcard ID from the stored cardId field
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
      case "Quiz Order":
        updateDetails.reorderQuizzes = oldValue;
        break;
      case "Flashcard Order":
        updateDetails.reorderFlashcards = oldValue;
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

  const changeDate = new Date(change.timestamp);

  return (
    <Modal
      maxWidth="7xl"
      isOpen={isOpen}
      onClose={onClose}
      title="Revert Change"
      className={`!bg-gradient-to-br !from-orange-50 !to-amber-50 dark:!from-gray-900 dark:!to-gray-800 rounded-2xl`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <ArrowUturnLeftIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
                Revert Change
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Review and confirm the change reversal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 dark:text-amber-200 font-medium text-sm">
              This action will revert the field to its previous value
            </p>
            <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
              This change will create a new log entry
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      <div
        ref={errorRef}
        className="mb-6 transition-opacity duration-300 ease-in-out"
      >
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-700/50">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium text-sm">
                  Revert Failed
                </p>
                <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                  {error.data?.error ||
                    "An error occurred while reverting changes."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200/50 dark:border-orange-700/50 mb-6">
        <div className="p-6">
          {/* Field and User Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-orange-200/50 dark:border-orange-700/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {change.field}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Field modification details
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              {change.user && (
                <div className="flex items-center gap-2 text-sm">
                  <UserCircleIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {change.user.name} (@{change.user.username})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <p className="font-semibold text-red-700 dark:text-red-300">
                  New Value (will be removed)
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-3">
                {/* have proper renderer for this later? */}
                {change.newDisplayText ? (
                  <pre className="whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {change.newDisplayText}
                  </pre>
                ) : (
                  <RichTextEditor
                    initialContent={change.newValue}
                    editable={false}
                  />
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  Previous Value (will be restored)
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3">
                {/* have proper renderer for this later? */}
                {change.oldDisplayText ? (
                  <pre className="whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {change.oldDisplayText}
                  </pre>
                ) : (
                  <RichTextEditor
                    initialContent={change.oldValue}
                    editable={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-4 flex flex-wrap gap-4 items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-400 ">
          {!user && "Login in to revert"}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium"
          >
            <XMarkIcon className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={handleRevert}
            disabled={isLoading || !user}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:from-orange-700 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-50  transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowUturnLeftIcon className="h-5 w-5" />
            )}
            {isLoading ? "Reverting..." : "Revert Change"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RevertChangeModal;
