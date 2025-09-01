import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useUpdateUserStrugglingQuizMutation } from "../../../api/apiSlice";

export const useFocusQuiz = (initialCard, card_id, strugglingQuizzes = [], onQuizMastered) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctQuizIds, setCorrectQuizIds] = useState(new Set()); // Track unique correct quiz IDs
  const [reviewQuizzes, setReviewQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [randomFact, setRandomFact] = useState(null);
  const [factLoading, setFactLoading] = useState(false);
  const location = useLocation();
  const timerRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const [updateStrugglingQuiz] = useUpdateUserStrugglingQuizMutation();

  // Check if we're on focus quiz page to avoid cache invalidation
  const isOnFocusQuizPage = location.pathname.includes("/focus-quiz");

  // Default settings from localStorage
  const defaultShowFacts =
    (localStorage.getItem("quiz-show-fun-facts") ?? "true") === "true";
  const [showFacts, setShowFacts] = useState(defaultShowFacts);

  // Reset state when struggling quizzes change (e.g., when navigating back from regular quiz)
  useEffect(() => {
    setShowCompletion(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectQuizIds(new Set());
    setReviewQuizzes([]);
    setCompletedQuizzes(new Set());
    setUserHasInteracted(false);
    setRandomFact(null);
    clearTimeout(timerRef.current);
  }, [strugglingQuizzes, card_id]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Filter initial quizzes to only include struggling quizzes
  const focusQuizzes = useMemo(() => {
    if (!strugglingQuizzes || strugglingQuizzes.length === 0) {
      return [];
    }

    // Check if strugglingQuizzes already contain the full quiz data (new API structure)
    const hasFullData = strugglingQuizzes.length > 0 && strugglingQuizzes[0].quizQuestion;

    if (hasFullData) {
      // New API structure: strugglingQuizzes already contain question and answer
      return strugglingQuizzes.map((strugglingQuiz) => ({
        _id: strugglingQuiz._id || strugglingQuiz.quizId,
        quizQuestion: strugglingQuiz.quizQuestion,
        quizAnswer: strugglingQuiz.quizAnswer,
        options: strugglingQuiz.options || [],
        minimumOptions: strugglingQuiz.minimumOptions || 2,
        addedAt: strugglingQuiz.addedAt,
        attemptCount: strugglingQuiz.attemptCount,
      }));
    } else {
      // Legacy structure: filter initialCard quizzes based on struggling quiz IDs
      const strugglingQuizIds = new Set(
        strugglingQuizzes.map((strugglingQuiz) => strugglingQuiz.quizId?.toString())
      );
      return (initialCard?.quizzes || []).filter((quiz) =>
        strugglingQuizIds.has(quiz._id?.toString())
      );
    }
  }, [initialCard, strugglingQuizzes]);

  // Session quizzes include focus quizzes plus any review quizzes added during the session
  const sessionQuizzes = useMemo(() => {
    const quizzesWithOriginalIndex = focusQuizzes.map((quiz, index) => ({
      ...quiz,
      originalIndex: index,
    }));

    const reviewQuizzesWithMeta = reviewQuizzes.map((quiz) => ({
      ...quiz,
      isReview: true,
      originalIndex: focusQuizzes.findIndex((q) => q.quizQuestion === quiz.quizQuestion),
    }));

    return [...quizzesWithOriginalIndex, ...reviewQuizzesWithMeta];
  }, [focusQuizzes, reviewQuizzes]);

  const currentQuestion = sessionQuizzes[currentQuestionIndex];

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.quizAnswer,
      ...(currentQuestion.options || [])
        .map((opt) => opt.value)
        .filter((opt) => opt !== currentQuestion.quizAnswer),
    ];
    return options.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  // Check if we have no struggling quizzes to show
  const hasNoStrugglingQuizzes = focusQuizzes.length === 0;

  // Show completion only when we have no struggling quizzes, not when quizzes are mastered locally
  useEffect(() => {
    if (hasNoStrugglingQuizzes && !showCompletion) {
      setShowCompletion(true);
    }
  }, [hasNoStrugglingQuizzes, showCompletion]);

  // Fetch random fact function
  const fetchRandomFact = useCallback(async () => {
    setFactLoading(true);
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );
      const data = await response.json();
      setRandomFact(data.text);
    } catch (error) {
      setRandomFact("Could not load a fun fact, but you're doing great!");
    }
    setFactLoading(false);
  }, []);

  const navigate = useCallback(
    (direction, justAddedReviewQuiz = false) => {
      if (sessionQuizzes.length === 0) return;

      // Mark that user has interacted
      setUserHasInteracted(true);

      const isLastQuiz = currentQuestionIndex === sessionQuizzes.length - 1;
      const isFirstQuiz = currentQuestionIndex === 0;

      if (direction === "next" && isLastQuiz && !justAddedReviewQuiz) {
        setShowCompletion(true);
        return;
      }

      // Prevent navigation beyond boundaries
      if (direction === "next" && isLastQuiz) return;
      if (direction === "prev" && isFirstQuiz) return;

      // Reset current question state
      setSelectedAnswer(null);
      setRandomFact(null);
      clearTimeout(timerRef.current);

      setTimeout(() => {
        let newIndex;
        if (direction === "next") {
          newIndex = currentQuestionIndex + 1;
          // Double-check bounds to prevent overflow
          if (newIndex >= sessionQuizzes.length) {
            if (!justAddedReviewQuiz) {
              setShowCompletion(true);
              return;
            }
            newIndex = sessionQuizzes.length - 1;
          }
        } else {
          newIndex = currentQuestionIndex - 1;
          // Prevent underflow
          if (newIndex < 0) {
            newIndex = 0;
            return; // Don't navigate if already at first question
          }
        }

        setCurrentQuestionIndex(newIndex);
      }, 150);
    },
    [currentQuestionIndex, sessionQuizzes]
  );

  const handleNext = (justAddedReviewQuiz = false) =>
    navigate("next", justAddedReviewQuiz);
  const handlePrev = () => navigate("prev");

  const handleQuizSelect = (index) => {
    if (index === currentQuestionIndex) return;

    // Mark that user has interacted
    setUserHasInteracted(true);

    // Reset current question state
    setSelectedAnswer(null);
    setRandomFact(null);
    clearTimeout(timerRef.current);
    setCurrentQuestionIndex(index);
  };

  const handleAnswerSelect = async (option) => {
    if (selectedAnswer || !currentQuestion) return;

    const isCorrect = option === currentQuestion.quizAnswer;
    const willAddReviewQuiz = !isCorrect;
    const willRemoveFromStrugglingQuizzes = isCorrect;

    // Track unique correct quiz IDs instead of simple score increment
    if (isCorrect && currentQuestion._id) {
      setCorrectQuizIds((prev) => new Set(prev).add(currentQuestion._id));
    }
    
    setSelectedAnswer({ option, isCorrect });

    // Mark that user has interacted
    setUserHasInteracted(true);

    if (showFacts) fetchRandomFact();

    // Update struggling quizzes based on answer
    // On focus quiz page: only call API for correct answers (removal) 
    // Don't call API for incorrect answers as those quizzes are already in strugglingQuizzes
    if (user && card_id && currentQuestion?._id && !willAddReviewQuiz) {
      try {
        await updateStrugglingQuiz({
          cardId: card_id,
          quizId: currentQuestion._id,
          action: "remove", // Remove from struggling quizzes when answered correctly
          skipFocusQuizInvalidation: isOnFocusQuizPage,
        });

        // Track quizzes that were mastered for cache invalidation on navigation
        if (willRemoveFromStrugglingQuizzes && onQuizMastered) {
          onQuizMastered();
        }
      } catch (error) {
        // Continue with the quiz flow even if struggling quiz update fails
      }
    }

    // Only track as completed, don't add wrong questions back to the end
    // But always count as practiced (both correct and incorrect attempts)
    setCompletedQuizzes((prev) => new Set(prev).add(currentQuestion.quizQuestion));

    const timerValue = showFacts ? 3500 : 1500;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (currentQuestionIndex < sessionQuizzes.length - 1) {
        handleNext(willAddReviewQuiz);
      } else {
        setShowCompletion(true);
      }
    }, timerValue);
  };

  const handleRandomFactToggle = () => {
    setShowFacts((prev) => {
      localStorage.setItem("quiz-show-fun-facts", !prev);
      return !prev;
    });
  };

  const restartFocusQuiz = () => {
    clearTimeout(timerRef.current);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectQuizIds(new Set());
    setReviewQuizzes([]);
    setCompletedQuizzes(new Set());
    setRandomFact(null);
    setShowCompletion(false);
    setUserHasInteracted(false);
  };

  // Navigation state helpers
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === sessionQuizzes.length - 1;
  
  // Calculate score based on unique correct quiz IDs
  const score = correctQuizIds.size;

  return {
    // Quiz state
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    score,
    shuffledOptions,
    sessionQuizzes,
    focusQuizzes,
    hasNoStrugglingQuizzes,
    showCompletion,
    completedQuizzes,
    
    // Navigation state
    isFirstQuestion,
    isLastQuestion,
    
    // Fact functionality
    randomFact,
    factLoading,
    showFacts,
    
    // Handlers
    handleAnswerSelect,
    handleNext,
    handlePrev,
    handleQuizSelect,
    handleRandomFactToggle,
    restartFocusQuiz,
  };
};