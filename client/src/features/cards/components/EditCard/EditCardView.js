import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectCurrentCard } from "../../state/cardSlice";
import EditCardHeader from "./EditCardHeader";
import QuizManagementView from "./QuizManagementView";
import FlashcardManagementView from "./FlashcardManagementView";
import ViewSwitcher from "./ViewSwitcher";

const EditCardView = () => {
  const card = useSelector(selectCurrentCard);
  const { _id, review = [], quizzes = [] } = card || {};
  
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "flashcards";
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");

  const filteredFlashcards = useMemo(() => {
    if (!review) return [];
    return review.filter(
      (flashcard) =>
        flashcard.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [review, searchTerm]);

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    return quizzes.filter(
      (quiz) =>
        (quiz.quizQuestion &&
          quiz.quizQuestion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (quiz.options &&
          quiz.options.some(
            (option) =>
              option.value &&
              option.value.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [quizzes, searchTerm]);

  const cardNoQuery = useMemo(
    () => parseInt(searchParams.get("cardNo"), 10),
    [searchParams]
  );

  const quizNoQuery = useMemo(
    () => parseInt(searchParams.get("quizNo"), 10),
    [searchParams]
  );

  useEffect(() => {
    const isFlashcardView = view === "flashcards";
    const items = isFlashcardView ? filteredFlashcards : filteredQuizzes;
    const paramName = isFlashcardView ? "cardNo" : "quizNo";
    const itemNo = isFlashcardView ? cardNoQuery : quizNoQuery;

    if (items.length === 0) {
      handleSetSearchParams(paramName, "");
      setCurrentIndex(0);
      return;
    }

    let targetIndex = itemNo ? itemNo - 1 : 0;

    if (
      Number.isNaN(targetIndex) ||
      targetIndex < 0 ||
      targetIndex >= items.length
    ) {
      targetIndex = 0;
      handleSetSearchParams(paramName, "1");
    }

    handleIndexChange(targetIndex);
  }, [
    cardNoQuery,
    quizNoQuery,
    filteredFlashcards.length,
    filteredQuizzes.length,
    view,
  ]);

  const handleSetSearchParams = (key, value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  const handleIndexChange = (newIndex, direction) => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    if (newIndex >= 0 && newIndex < items.length) {
      setAnimationDirection(direction);
      setCurrentIndex(newIndex);
      const paramName = view === "flashcards" ? "cardNo" : "quizNo";
      handleSetSearchParams(paramName, (newIndex + 1).toString());
    } else if (items.length === 0) {
      setCurrentIndex(0);
      const paramName = view === "flashcards" ? "cardNo" : "quizNo";
      handleSetSearchParams(paramName, "");
    }
  };

  const handleNext = () => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    handleIndexChange((currentIndex + 1) % items.length, "left");
  };

  const handlePrev = () => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    handleIndexChange(
      (currentIndex - 1 + items.length) % items.length,
      "right"
    );
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSetSearchParams("search", newSearchTerm);
    handleIndexChange(0, "right");
  };

  const handleReset = () => {
    setSearchTerm("");
    handleSetSearchParams("search", "");
    handleIndexChange(0, "right");
  };

  const currentItem =
    view === "flashcards"
      ? filteredFlashcards[currentIndex]
      : filteredQuizzes[currentIndex];

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
        totalFlashcards={review.length}
        totalQuizzes={quizzes.length}
      />

      {view === "flashcards" ? (
        <FlashcardManagementView
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentIndex={currentIndex}
          totalCount={filteredFlashcards.length}
          currentFlashcard={currentItem}
          cardId={_id}
          animationDirection={animationDirection}
          handleIndexChange={handleIndexChange}
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
        />
      )}
    </div>
  );
};

export default EditCardView;
