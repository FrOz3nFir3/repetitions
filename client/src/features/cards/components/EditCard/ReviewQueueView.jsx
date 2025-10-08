import { useState } from "react";
import ReviewQueueItem from "./ReviewQueueItem";
import ReviewQueueModal from "./ReviewQueueModal";
import ReviewQueueListModal from "./ReviewQueueListModal";
import { ClipboardDocumentCheckIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  useAcceptReviewItemMutation,
  useRejectReviewItemMutation,
} from "../../../../api/apiSlice";
import toast from "react-hot-toast";

const ReviewQueueView = ({ cardId, reviewQueue, reviewQueueLength }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [acceptReviewItem, { isLoading: isAccepting }] =
    useAcceptReviewItemMutation();
  const [rejectReviewItem, { isLoading: isRejecting }] =
    useRejectReviewItemMutation();

  const [actionError, setActionError] = useState(null);

  // Check if there are more items than what's shown
  const hasMoreItems = reviewQueueLength > reviewQueue.length;

  const handleAccept = async (itemId) => {
    try {
      setActionError(null);
      const response = await acceptReviewItem({ cardId, itemId }).unwrap();
      toast.success(response.message);
    } catch (error) {
      console.error("Failed to accept review item:", error);
      setActionError(
        error?.data?.error || "Failed to accept review item. Please try again."
      );
    }
  };

  const handleReject = async (itemId) => {
    try {
      setActionError(null);
      const response = await rejectReviewItem({ cardId, itemId }).unwrap();
      toast.success(response.message);
    } catch (error) {
      console.error("Failed to reject review item:", error);
      setActionError(
        error?.data?.error || "Failed to reject review item. Please try again."
      );
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalAccept = async () => {
    if (selectedItem) {
      try {
        await handleAccept(selectedItem._id);
        setIsModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        // Error is already handled in handleAccept
        // Keep modal open to show error
      }
    }
  };

  const handleModalReject = async () => {
    if (selectedItem) {
      try {
        await handleReject(selectedItem._id);
        setIsModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        // Error is already handled in handleReject
        // Keep modal open to show error
      }
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-lg">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-700 dark:from-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
                Review Queue
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {reviewQueueLength > 0
                  ? `${reviewQueueLength} pending collaborative change${
                      reviewQueueLength > 1 ? "s" : ""
                    }`
                  : "No pending changes"}
              </p>
            </div>
          </div>

          {hasMoreItems && (
            <button
              onClick={() => setIsListModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
            >
              <EyeIcon className="h-4 w-4" />
              View All ({reviewQueueLength})
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {actionError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {actionError}
            </p>
            <button
              onClick={() => setActionError(null)}
              className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Review Queue Content */}
      {reviewQueue.length > 0 ? (
        <div className="space-y-4">
          {reviewQueue.map((item) => (
            <ReviewQueueItem
              key={item._id}
              queueItem={item}
              onAccept={() => handleAccept(item._id)}
              onReject={() => handleReject(item._id)}
              onViewDetails={() => handleViewDetails(item)}
              isAccepting={isAccepting}
              isRejecting={isRejecting}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl inline-block mb-4">
            <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            No pending reviews
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md mx-auto">
            All changes have been reviewed! New collaborative edits will appear
            here for your approval.
          </p>
        </div>
      )}

      {/* Review Queue Detail Modal */}
      {isModalOpen && selectedItem && (
        <ReviewQueueModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
            setActionError(null);
          }}
          queueItem={selectedItem}
          onAccept={handleModalAccept}
          onReject={handleModalReject}
          isAccepting={isAccepting}
          isRejecting={isRejecting}
          error={actionError}
        />
      )}

      {/* Review Queue List Modal */}
      <ReviewQueueListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        cardId={cardId}
      />
    </div>
  );
};

export default ReviewQueueView;
