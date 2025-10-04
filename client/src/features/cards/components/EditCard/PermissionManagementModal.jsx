import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useGetReviewersQuery,
  useAddReviewersMutation,
  useRemoveReviewerMutation,
  useSearchUsersQuery,
} from "../../../../api/apiSlice";
import { selectCurrentCard } from "../../state/cardSlice";
import { selectCurrentUser } from "../../../authentication/state/authSlice";
import Modal from "../../../../components/ui/Modal";
import {
  UserGroupIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

const PermissionManagementModal = ({ isOpen, onClose }) => {
  const card = useSelector(selectCurrentCard);
  const currentUser = useSelector(selectCurrentUser);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showConfirmRemove, setShowConfirmRemove] = useState(null);
  const errorRef = useRef(null);

  // Debounce search term with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset page when search term changes
      setPage(1);
      setAllSearchResults([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API hooks - only load when modal is open
  const {
    data: reviewersData,
    isLoading: reviewersLoading,
    error: reviewersError,
  } = useGetReviewersQuery(card?._id, {
    skip: !card?._id || !isOpen,
  });

  // Handle different response structures
  const reviewers = Array.isArray(reviewersData)
    ? reviewersData
    : Array.isArray(reviewersData?.data)
    ? reviewersData.data
    : Array.isArray(reviewersData?.reviewers)
    ? reviewersData.reviewers
    : [];

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
    isFetching: searchFetching,
  } = useSearchUsersQuery(
    { search: debouncedSearchTerm, id: card?._id, page },
    {
      skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2 || !isOpen,
    }
  );

  // Accumulate search results across pages
  const [allSearchResults, setAllSearchResults] = useState([]);

  useEffect(() => {
    if (searchData && !searchError) {
      const newResults = Array.isArray(searchData)
        ? searchData
        : Array.isArray(searchData?.data)
        ? searchData.data
        : Array.isArray(searchData?.users)
        ? searchData.users
        : [];

      if (page === 1) {
        // Reset results for new search
        setAllSearchResults(newResults);
      } else {
        // Append results for pagination - avoid duplicates
        setAllSearchResults((prev) => {
          const existingIds = new Set(prev.map((user) => user._id));
          const uniqueNewResults = newResults.filter(
            (user) => !existingIds.has(user._id)
          );
          return [...prev, ...uniqueNewResults];
        });
      }
    }
  }, [searchData, searchError, page]);

  const searchResults = allSearchResults;

  const [addReviewers, { isLoading: addingReviewers, error: addError }] =
    useAddReviewersMutation();

  const [removeReviewer, { isLoading: removingReviewer, error: removeError }] =
    useRemoveReviewerMutation();

  // Scroll to error when it appears
  useEffect(() => {
    if ((addError || removeError) && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [addError, removeError]);

  const handleAddReviewers = async () => {
    if (selectedUsers.length === 0) return;

    const userIds = selectedUsers.map((user) => user._id);
    try {
      await addReviewers({ cardId: card._id, userIds }).unwrap();
      setSelectedUsers([]);
      setSearchTerm("");
    } catch (error) {
      // Error handled by RTK Query
    }
  };

  const handleRemoveReviewer = async (userId) => {
    try {
      await removeReviewer({ cardId: card._id, userId }).unwrap();
      setShowConfirmRemove(null);
    } catch (error) {
      // Error handled by RTK Query
    }
  };

  const handleUserSelect = (user) => {
    // Don't allow selecting users who are already reviewers
    const isAlreadyReviewer =
      Array.isArray(reviewers) &&
      reviewers.some((reviewer) => reviewer._id === user._id);
    if (isAlreadyReviewer) return;

    // Don't allow selecting the same user twice
    const isAlreadySelected = selectedUsers.some(
      (selected) => selected._id === user._id
    );
    if (isAlreadySelected) return;

    setSelectedUsers([...selectedUsers, user]);
  };

  const handleRemoveSelected = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  // Filter search results to exclude current reviewers and selected users
  const filteredSearchResults = Array.isArray(searchResults)
    ? searchResults.filter((user) => {
        const isReviewer =
          Array.isArray(reviewers) &&
          reviewers.some((reviewer) => reviewer._id === user._id);
        const isSelected = selectedUsers.some(
          (selected) => selected._id === user._id
        );
        return !isReviewer && !isSelected;
      })
    : [];

  const isAuthor = (username) => {
    // Handle both string and object author formats
    const autorUsername =
      typeof card?.author === "object" ? card?.author?.username : card?.author;
    return autorUsername === username;
  };

  const hasMore = searchData?.hasMore ?? false;

  return (
    <Modal
      maxWidth="4xl"
      isOpen={isOpen}
      onClose={onClose}
      className="!bg-gradient-to-br !from-blue-50 !to-indigo-50 dark:!from-gray-900 dark:!to-gray-800 rounded-2xl"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                Manage Reviewers
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Control who can contribute directly to this flashcard set
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
      </div>

      {/* Error Display */}
      <div
        ref={errorRef}
        className="mb-6 transition-opacity duration-300 ease-in-out"
      >
        {(addError || removeError) && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-700/50">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium text-sm">
                  Operation Failed
                </p>
                <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                  {addError?.data?.error ||
                    removeError?.data?.error ||
                    "An error occurred while managing reviewers."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Permission Check - Show fallback if API returns permission error */}
      {reviewersError?.status === 403 || reviewersError?.status === 401 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-red-200/50 dark:border-red-700/50 mb-6">
          <div className="p-8 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full inline-block mb-4">
              <LockClosedIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have permission to manage reviewers for this flashcard
              set. Only the author and existing reviewers can manage
              permissions.
            </p>
            <button
              onClick={onClose}
              className="cursor-pointer px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* User Search Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-700/50 mb-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Reviewers
                </h3>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users by name or username or email..."
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selected Users ({selectedUsers.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg text-sm"
                      >
                        <UserCircleIcon className="h-4 w-4" />
                        <span>
                          {user.name} (@{user.username})
                        </span>
                        <button
                          onClick={() => handleRemoveSelected(user._id)}
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-300"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchTerm.length >= 2 && (
                <div className="mb-4">
                  {searchLoading ||
                  (debouncedSearchTerm !== searchTerm &&
                    searchTerm.length >= 2) ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="animate-pulse flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredSearchResults.length > 0 ? (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {filteredSearchResults.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          className="cursor-pointer flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                        >
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {(user.name || user.username || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {user.name || user.username || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              @{user.username}
                            </p>
                          </div>
                          <PlusIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        </div>
                      ))}
                      {hasMore && (
                        <div className="flex flex-col items-center justify-center pt-6 pb-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                          <button
                            onClick={() => setPage((prevPage) => prevPage + 1)}
                            disabled={searchFetching}
                            className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                          >
                            {searchFetching ? (
                              <>
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                <span>Loading More...</span>
                              </>
                            ) : (
                              <>
                                <PlusIcon className="h-5 w-5" />
                                <span>Load More Users</span>
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Showing {allSearchResults.length} users
                          </p>
                        </div>
                      )}
                    </div>
                  ) : debouncedSearchTerm.length >= 2 ? (
                    <div className="text-center py-6">
                      <UserCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        No users found
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Try searching with a different username or email
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Add Button */}
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleAddReviewers}
                  disabled={addingReviewers}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium"
                >
                  {addingReviewers ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                  {addingReviewers
                    ? "Adding..."
                    : `Add ${selectedUsers.length} Reviewer${
                        selectedUsers.length > 1 ? "s" : ""
                      }`}
                </button>
              )}
            </div>
          </div>

          {/* Current Reviewers Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 dark:border-blue-700/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Reviewers (
                  {Array.isArray(reviewers) ? reviewers.length : 0})
                </h3>
              </div>

              {reviewersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    Loading reviewers...
                  </span>
                </div>
              ) : reviewersError ? (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 dark:text-red-400">
                    Failed to load reviewers
                  </p>
                </div>
              ) : Array.isArray(reviewers) && reviewers.length > 0 ? (
                <div className="space-y-3">
                  {reviewers.map((reviewer) => (
                    <div
                      key={reviewer._id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {(reviewer.name || reviewer.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {reviewer.name}
                            </p>
                            {isAuthor(reviewer._id) && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                                <ShieldCheckIcon className="h-3 w-3" />
                                Author
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            @{reviewer.username}
                          </p>
                        </div>
                      </div>

                      {!isAuthor(reviewer.username) &&
                        reviewer.username !== currentUser?.username && (
                          <button
                            onClick={() => setShowConfirmRemove(reviewer)}
                            disabled={removingReviewer}
                            className="cursor-pointer p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviewers found
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Remove Confirmation Modal */}
      {showConfirmRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Remove Reviewer
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove{" "}
              <strong>{showConfirmRemove.name}</strong> from the reviewers list?
              They will no longer be able to contribute to this flashcard set.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmRemove(null)}
                disabled={removingReviewer}
                className="cursor-pointer px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveReviewer(showConfirmRemove._id)}
                disabled={removingReviewer}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {removingReviewer ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <TrashIcon className="h-4 w-4" />
                )}
                {removingReviewer ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 mt-6 flex justify-end border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="cursor-pointer px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 font-medium"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};

export default PermissionManagementModal;
