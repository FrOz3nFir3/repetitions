import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import QuizDetail from "./QuizDetail";
import EditQuizModal from "./EditQuizModal";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { getTextFromHtml } from "../../../../utils/dom";
import SearchableDropdown from "../../components/ui/SearchableDropdown";
import EmptyState from "../../../../components/ui/EmptyState";

const QuizManagementView = ({
  quizzes,
  cardId,
  searchTerm,
  handleSearchChange,
  handleReset,
  currentIndex,
  handleIndexChange,
  handleNext,
  handlePrev,
  review,
  initialFilteredQuizzes,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(
    searchParams.get("flashcardFilter") || null
  );
  const [jumpToIndex, setJumpToIndex] = useState("");

  const [updateCard, { isLoading: isDeleting }] = usePatchUpdateCardMutation();

  const filteredQuizzes = useMemo(() => {
    if (!selectedFlashcardId) {
      return initialFilteredQuizzes;
    }
    return initialFilteredQuizzes.filter(
      (quiz) => quiz.flashcardId === selectedFlashcardId
    );
  }, [initialFilteredQuizzes, selectedFlashcardId]);

  const handleEditClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedQuiz) {
      await updateCard({
        _id: cardId,
        quizId: selectedQuiz._id,
        deleteQuiz: true,
      }).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
    }
  };

  const flashcardDropdownOptions = useMemo(
    () =>
      review.map((flashcard, index) => {
        const plainText = getTextFromHtml(flashcard.question);
        const truncatedText =
          plainText.length > 50
            ? `${plainText.substring(0, 50)}...`
            : plainText;
        return {
          value: flashcard._id,
          label: `${index + 1}. ${truncatedText}`,
        };
      }),
    [review]
  );

  const handleFlashcardSelect = (value) => {
    const newFilter = value;
    setSelectedFlashcardId(newFilter);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newFilter) {
        newParams.set("flashcardFilter", newFilter);
      } else {
        newParams.delete("flashcardFilter");
      }
      newParams.delete("quizNo");
      return newParams;
    });
    handleIndexChange(0); // Reset index when filter changes
  };

  const handleJump = (e) => {
    e.preventDefault();
    const index = parseInt(jumpToIndex, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < filteredQuizzes.length) {
      handleIndexChange(index);
      setJumpToIndex("");
    }
  };

  const currentQuiz = filteredQuizzes[currentIndex];

  const originalQuizIndex = useMemo(() => {
    if (!currentQuiz || !quizzes) return 0;
    return quizzes.findIndex((q) => q._id === currentQuiz._id) + 1;
  }, [currentQuiz, quizzes]);

  return (
    <div className="mt-4">
      {/* Search and Filter Controls */}

      <div className="flex  flex-col sm:flex-row gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quiz questions or answers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={handleReset}
              className="cursor-pointer absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="w-full sm:w-50">
          <SearchableDropdown
            options={flashcardDropdownOptions}
            value={selectedFlashcardId}
            onChange={handleFlashcardSelect}
            placeholder="Filter by flashcard..."
          />
        </div>
      </div>

      {/* Navigation Controls */}
      {filteredQuizzes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between my-6 gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrev}
              disabled={filteredQuizzes.length <= 1}
              className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Quiz {currentIndex + 1} of {filteredQuizzes.length}
            </span>
            <button
              onClick={handleNext}
              disabled={filteredQuizzes.length <= 1}
              className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleJump} className="flex items-center space-x-2">
            <input
              type="number"
              value={jumpToIndex}
              onChange={(e) => setJumpToIndex(e.target.value)}
              className="w-24 p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={`1-${filteredQuizzes.length}`}
              min="1"
              max={filteredQuizzes.length}
            />
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Go
            </button>
          </form>
        </div>
      )}

      {filteredQuizzes.length > 0 ? (
        <QuizDetail
          quiz={currentQuiz}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          originalQuizIndex={originalQuizIndex}
        />
      ) : (
        <EmptyState
          message={
            searchTerm || selectedFlashcardId
              ? "No Results Found"
              : "No Quizzes Available"
          }
          details={
            searchTerm || selectedFlashcardId
              ? "No quizzes match your search or filter criteria."
              : "This card does not have any quizzes yet."
          }
        />
      )}

      {isEditModalOpen && selectedQuiz && (
        <EditQuizModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          quiz={selectedQuiz}
          cardId={cardId}
          flashcardId={selectedQuiz.flashcardId}
          flashcards={review}
        />
      )}
      {isDeleteModalOpen && selectedQuiz && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Quiz"
          description={`Are you sure you want to delete the quiz? This action is irreversible.`}
        />
      )}
    </div>
  );
};

export default QuizManagementView;
