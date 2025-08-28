import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentCard } from "../../state/cardSlice";
import EditCardHeader from "./EditCardHeader";
import QuizManagementView from "./QuizManagementView";
import FlashcardManagementView from "./FlashcardManagementView";
import ViewSwitcher from "./ViewSwitcher";
import { useEditCardManager } from "../../hooks/useEditCardManager";

const EditCardView = () => {
  const card = useSelector(selectCurrentCard);
  const { _id, review = [], quizzes = [] } = card || {};

  const {
    view,
    setSearchParams,
    searchTerm,
    currentIndex,
    animationDirection,
    filteredFlashcards,
    filteredQuizzes,
    currentItem,
    originalFlashcardIndex,
    handleSearchChange,
    handleReset,
    handlePrev,
    handleNext,
    handleJump,
    handleIndexChange,
  } = useEditCardManager(card);

  const reviewMap = useMemo(() => {
    const map = new Map();
    review.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [review]);

  const quizMap = useMemo(() => {
    const map = new Map();
    quizzes.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [quizzes]);

  if (!card) {
    return null; // Or a loading state
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <EditCardHeader
        flashcardId={_id}
        view={view}
        setSearchParams={setSearchParams}
        card={card}
      />
      <ViewSwitcher
        view={view}
        setSearchParams={setSearchParams}
        totalFlashcards={card?.reviewLength ?? review.length}
        totalQuizzes={card?.quizzesLength ?? quizzes.length}
      />

      {view === "flashcards" ? (
        <FlashcardManagementView
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleJump={handleJump}
          currentIndex={currentIndex}
          totalCount={filteredFlashcards.length}
          currentFlashcard={currentItem}
          cardId={_id}
          animationDirection={animationDirection}
          originalFlashcardIndex={originalFlashcardIndex}
          filteredFlashcards={filteredFlashcards}
          handleIndexChange={handleIndexChange}
          reviewMap={reviewMap}
        />
      ) : (
        <QuizManagementView
          quizzes={quizzes}
          cardId={_id}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          currentIndex={currentIndex}
          handleIndexChange={handleIndexChange}
          initialFilteredQuizzes={filteredQuizzes}
          handleNext={handleNext}
          handlePrev={handlePrev}
          review={review}
          quizMap={quizMap}
        />
      )}
    </div>
  );
};

export default EditCardView;
