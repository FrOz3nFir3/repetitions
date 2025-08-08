import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePatchUpdateUserProgressMutation } from "../../../api/apiSlice";
import {
  selectCurrentUser,
  modifyUser,
} from "../../authentication/state/authSlice";

export const useQuizSession = (card, onFinish) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [updateUser] = usePatchUpdateUserProgressMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [randomFact, setRandomFact] = useState(null);
  const [factLoading, setFactLoading] = useState(false);
  const timerRef = useRef(null);

  const defaultShowFacts =
    (localStorage.getItem("quiz-show-fun-facts") ?? "true") === "true";
  const [showFacts, setShowFacts] = useState(defaultShowFacts);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => clearTimeout(timerRef.current);
  }, []);
  const quizzes = useMemo(() => card?.quizzes || [], [card]);
  const currentQuestion = useMemo(
    () => quizzes[currentQuestionIndex],
    [quizzes, currentQuestionIndex]
  );

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

  const fetchRandomFact = useCallback(async () => {
    setFactLoading(true);
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
      );
      const data = await response.json();
      setRandomFact(data.text);
    } catch (error) {
      // console.error("Failed to fetch random fact:", error);
      setRandomFact("Could not load a fun fact, but you're doing great!");
    }
    setFactLoading(false);
  }, []);

  const handleAnswerSelect = (option) => {
    if (selectedAnswer || !currentQuestion) return;
    const isCorrect = option === currentQuestion.quizAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setSelectedAnswer({ option, isCorrect });

    if (showFacts) fetchRandomFact();
    const timerValue = showFacts ? 3500 : 1500;

    clearTimeout(timerRef.current); // Clear any existing timer
    timerRef.current = setTimeout(() => {
      if (currentQuestionIndex < quizzes.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setRandomFact(null);
      } else {
        onFinish();
      }
    }, timerValue);

    if (user) {
      const updateDetails = {
        card_id: card._id,
        quiz_id: currentQuestion._id,
        correct: isCorrect,
        isFirstQuestion: currentQuestionIndex === 0,
        isLastQuestion: currentQuestionIndex === quizzes.length - 1,
      };
      updateUser(updateDetails).then(() => {
        if (updateDetails.isFirstQuestion)
          dispatch(modifyUser({ card_id: card._id, type: "times-started" }));
        if (updateDetails.isLastQuestion)
          dispatch(modifyUser({ card_id: card._id, type: "times-finished" }));
        if (updateDetails.correct)
          dispatch(modifyUser({ card_id: card._id, type: "total-correct" }));
        else
          dispatch(modifyUser({ card_id: card._id, type: "total-incorrect" }));
      });
    }
  };

  const restartQuiz = () => {
    clearTimeout(timerRef.current); // Clear any pending timer
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setRandomFact(null);
  };
  const handleRandomFactToggle = () => {
    setShowFacts((prev) => {
      localStorage.setItem("quiz-show-fun-facts", !prev);
      return !prev;
    });
  };

  return {
    quizzes,
    currentQuestionIndex,
    selectedAnswer,
    score,
    randomFact,
    factLoading,
    showFacts,
    currentQuestion,
    shuffledOptions,
    handleAnswerSelect,
    restartQuiz,
    handleRandomFactToggle,
  };
};
