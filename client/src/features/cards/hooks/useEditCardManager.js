import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useEditCardManager = (card) => {
  const { review = [], quizzes = [] } = card || {};
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
        (quiz.quizAnswer &&
          quiz.quizAnswer.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

  const handleSetSearchParams = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handleIndexChange = (newIndex, direction = "") => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    const paramName = view === "flashcards" ? "cardNo" : "quizNo";

    if (newIndex >= 0 && newIndex < items.length) {
      setAnimationDirection(direction);
      setCurrentIndex(newIndex);
      handleSetSearchParams(paramName, (newIndex + 1).toString());
    } else {
      setCurrentIndex(0);
      handleSetSearchParams(paramName, "");
    }
  };

  useEffect(() => {
    // Guard clause: Don't run the effect until the data is loaded.
    if (!card) return;

    const isFlashcardView = view === "flashcards";
    const items = isFlashcardView ? filteredFlashcards : filteredQuizzes;
    const paramName = isFlashcardView ? "cardNo" : "quizNo";
    const itemNo = isFlashcardView ? cardNoQuery : quizNoQuery;

    if (items.length === 0) {
      handleIndexChange(0);
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

    if (targetIndex !== currentIndex) {
      setCurrentIndex(targetIndex);
    }
  }, [
    card,
    cardNoQuery,
    quizNoQuery,
    filteredFlashcards.length,
    filteredQuizzes.length,
    view,
  ]);

  const handleNext = () => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    if (items.length === 0) return;
    handleIndexChange((currentIndex + 1) % items.length, "left");
  };

  const handlePrev = () => {
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;
    if (items.length === 0) return;
    handleIndexChange(
      (currentIndex - 1 + items.length) % items.length,
      "right"
    );
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    handleSetSearchParams("search", newSearchTerm);
    handleIndexChange(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    handleSetSearchParams("search", "");
    handleIndexChange(0);
  };

  const handleJump = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jumpValue = formData.get("jumpToIndex");
    const jumpIndex = parseInt(jumpValue, 10) - 1;
    const items = view === "flashcards" ? filteredFlashcards : filteredQuizzes;

    if (jumpIndex >= 0 && jumpIndex < items.length) {
      handleIndexChange(jumpIndex, "");
      e.target.reset();
    }
  };

  const currentItem =
    view === "flashcards"
      ? filteredFlashcards[currentIndex]
      : filteredQuizzes[currentIndex];

  const originalFlashcardIndex = useMemo(() => {
    if (view !== "flashcards" || !currentItem || !review) return null;
    return (
      review.findIndex((flashcard) => flashcard._id === currentItem._id) + 1
    );
  }, [currentItem, review, view]);

  return {
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
  };
};
