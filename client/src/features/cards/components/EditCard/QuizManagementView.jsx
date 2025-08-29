import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import QuizControls from "./QuizControls";
import QuizNavigation from "./QuizNavigation";
import QuizList from "./QuizList";
import EditQuizModal from "./EditQuizModal";
import ReorderModal from "./ReorderModal";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { getTextFromHtml } from "../../../../utils/dom";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

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
  quizMap = new Map(),
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(
    searchParams.get("flashcardFilter") || null
  );

  const [updateCard] = usePatchUpdateCardMutation();

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

  const handleReorderClick = () => {
    setIsReorderModalOpen(true);
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
      review?.map((flashcard, index) => {
        const plainText = flashcard.question;
        return {
          value: flashcard._id,
          label: `Flashcard ${index + 1}`,
          description: plainText,
        };
      }),
    [review]
  );

  const handleFlashcardSelect = (value) => {
    const newFilter = value;
    handleIndexChange(0); // Reset index when filter changes
    setSelectedFlashcardId(newFilter);
    setSearchParams((prev) => {
      if (newFilter) {
        prev.set("flashcardFilter", newFilter);
      } else {
        prev.delete("flashcardFilter");
      }
      prev.delete("quizNo");
      return prev;
    });
  };

  const handleJump = (e) => {
    e.preventDefault();
    const index = parseInt(e.target.jumpToIndex.value, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < filteredQuizzes.length) {
      handleIndexChange(index);
      e.target.reset();
    }
  };

  const currentQuiz = filteredQuizzes[currentIndex];

  const originalQuizIndex = useMemo(() => {
    if (!currentQuiz || !quizzes) return 0;
    return quizzes.findIndex((q) => q._id === currentQuiz._id) + 1;
  }, [currentQuiz, quizzes]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Controls Section */}
      <div className="relative z-1 space-y-4">
        <QuizControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
          selectedFlashcardId={selectedFlashcardId}
          onFlashcardSelect={handleFlashcardSelect}
          flashcardOptions={flashcardDropdownOptions}
          filteredCount={filteredQuizzes.length}
        />

        {/* Navigation Section - Only show if we have quizzes */}
        {filteredQuizzes.length > 0 && (
          <QuizNavigation
            onPrev={handlePrev}
            onNext={handleNext}
            onJump={handleJump}
            currentIndex={currentIndex}
            totalCount={filteredQuizzes.length}
            disabled={filteredQuizzes.length <= 1}
            searchTerm={searchTerm}
            selectedFlashcardId={selectedFlashcardId}
            quizzes={filteredQuizzes}
            onQuizSelect={(index) => {
              handleIndexChange(index);
            }}
            quizMap={quizMap}
          />
        )}
      </div>

      {/* Quiz Content */}
      {filteredQuizzes.length > 0 ? (
        <QuizList
          quiz={currentQuiz}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onReorder={handleReorderClick}
          originalQuizIndex={originalQuizIndex}
          currentIndex={currentIndex}
          hasMultipleQuizzes={quizzes?.length > 1}
        />
      ) : (
        <div className="text-center py-12">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl inline-block mb-4">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            {searchTerm || selectedFlashcardId
              ? "No quizzes found"
              : "No quizzes available"}
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm max-w-md mx-auto">
            {searchTerm || selectedFlashcardId
              ? "Try different search terms or clear the filters to see all quizzes."
              : "Create your first quiz to get started with testing your knowledge!"}
          </p>
        </div>
      )}

      {/* Modals */}
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
      
      <ReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        cardId={cardId}
        contentType="quizzes"
        items={quizzes || []}
      />
      
      {isDeleteModalOpen && selectedQuiz && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Quiz"
          description={`Are you sure you want to delete this quiz? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default QuizManagementView;
