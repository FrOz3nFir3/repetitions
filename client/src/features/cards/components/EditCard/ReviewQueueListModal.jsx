import React, { useEffect, useState } from "react";
import ReviewQueueItem from "./ReviewQueueItem";
import ReviewQueueModal from "./ReviewQueueModal";
import CardLogSkeleton from "../../../../components/ui/skeletons/CardLogSkeleton";
import {
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useReviewQueue from "../../../../hooks/useReviewQueue";
import {
  useAcceptReviewItemMutation,
  useRejectReviewItemMutation,
} from "../../../../api/apiSlice";
import { toast } from "react-hot-toast";
const ReviewQueueListModal = ({ isOpen, onClose, cardId }) => {
  const {
    items: reviewQueue,
    isFetching,
    isError,
    lastItemElementRef,
  } = useReviewQueue(cardId, isOpen);

  const [acceptReviewItem, { isLoading: isAccepting }] =
    useAcceptReviewItemMutation();
  const [rejectReviewItem, { isLoading: isRejecting }] =
    useRejectReviewItemMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  const reviewQueueContentRef = React.useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
    setIsDetailModalOpen(true);
  };

  const handleModalAccept = async () => {
    if (selectedItem) {
      try {
        await handleAccept(selectedItem._id);
        setIsDetailModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        // Error is already handled in handleAccept
      }
    }
  };

  const handleModalReject = async () => {
    if (selectedItem) {
      try {
        await handleReject(selectedItem._id);
        setIsDetailModalOpen(false);
        setSelectedItem(null);
      } catch (error) {
        // Error is already handled in handleReject
      }
    }
  };

  // Filter review queue items based on search term
  const filteredItems = reviewQueue.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.field?.toLowerCase().includes(searchLower) ||
      item.changeType?.toLowerCase().includes(searchLower) ||
      item.submittedBy?.name?.toLowerCase().includes(searchLower) ||
      item.submittedBy?.username?.toLowerCase().includes(searchLower) ||
      (typeof item.newValue === "string" &&
        item.newValue.toLowerCase().includes(searchLower)) ||
      (typeof item.oldValue === "string" &&
        item.oldValue.toLowerCase().includes(searchLower))
    );
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-[60]"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 w-full max-w-2xl h-full shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-indigo-200/50 dark:border-indigo-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-800 dark:to-blue-800 px-6 py-4 border-b border-indigo-300/50 dark:border-indigo-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Review Queue</h2>
                <p className="text-indigo-100 text-sm">
                  All pending collaborative changes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
              placeholder="Search review items..."
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-white/60 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {actionError && (
          <div className="mx-6 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
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
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          ref={reviewQueueContentRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ height: "calc(100vh - 80px)" }}
        >
          {isError ? (
            <div className="text-center py-12">
              <div className="text-red-500 dark:text-red-400 mb-4">
                <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Failed to load review queue
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please try refreshing the page.
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            <>
              {filteredItems.map((item, index) => {
                const isLastItem = index === filteredItems.length - 1;
                return (
                  <ReviewQueueItem
                    key={item._id}
                    ref={isLastItem ? lastItemElementRef : null}
                    queueItem={item}
                    onAccept={() => handleAccept(item._id)}
                    onReject={() => handleReject(item._id)}
                    onViewDetails={() => handleViewDetails(item)}
                    isAccepting={isAccepting}
                    isRejecting={isRejecting}
                  />
                );
              })}

              {/* Loading skeleton for pagination */}
              {isFetching && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <CardLogSkeleton key={`skeleton-${i}`} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl inline-block mb-4">
                <ClipboardDocumentCheckIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                {searchTerm ? "No matching review items" : "No pending reviews"}
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md mx-auto">
                {searchTerm
                  ? "Try different search terms or clear the search to see all review items."
                  : "All changes have been reviewed! New collaborative edits will appear here for your approval."}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Review Queue Detail Modal */}
        {isDetailModalOpen && selectedItem && (
          <ReviewQueueModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
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
      </div>
    </div>
  );
};

export default ReviewQueueListModal;
