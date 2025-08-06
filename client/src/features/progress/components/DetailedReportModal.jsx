import React, { useState, useMemo } from "react";
import {
  useGetDetailedReportQuery,
  useGetIndividualCardQuery,
} from "../../../api/apiSlice";
import {
  XMarkIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrophyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ClockIcon,
  ChartPieIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Modal from "../../../components/ui/Modal";
import DetailedReportModalSkeleton from "../../../components/ui/skeletons/DetailedReportModalSkeleton";
import HtmlRenderer from "../../../components/ui/HtmlRenderer";

function DetailedReportModal({ cardId, isOpen, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const [isQuestionDropdownOpen, setIsQuestionDropdownOpen] = useState(false);

  const {
    data: reportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
  } = useGetDetailedReportQuery(cardId, { skip: !isOpen });

  const {
    data: cardData,
    isLoading: isLoadingCard,
    isError: isErrorCard,
  } = useGetIndividualCardQuery(cardId, { skip: !isOpen });

  const isLoading = isLoadingReport || isLoadingCard;
  const isError = isErrorReport || isErrorCard;

  const mergedReport = useMemo(() => {
    if (!reportData || !cardData || !cardData.quizzes) return [];

    const quizMap = new Map(cardData.quizzes.map((quiz) => [quiz._id, quiz]));

    return reportData
      .map((attempt) => {
        const quizDetails = quizMap.get(attempt.quiz_id);
        if (!quizDetails) return null;

        return {
          ...attempt,
          question: quizDetails.quizQuestion,
          answer: quizDetails.quizAnswer,
          options:
            [...quizDetails.options, { value: quizDetails.quizAnswer }] || [],
        };
      })
      .filter(Boolean);
  }, [reportData, cardData]);

  const currentQuestion = mergedReport[currentQuestionIndex];

  // Shuffle options like in QuizView
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const options = [
      currentQuestion.answer,
      ...currentQuestion.options
        .map((opt) => opt.value)
        .filter((opt) => opt !== currentQuestion.answer),
    ];
    return options.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleNext = () => {
    if (currentQuestionIndex < mergedReport.length - 1) {
      setSlideDirection("left");
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSlideDirection("in-right");
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setSlideDirection("right");
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev - 1);
        setSlideDirection("in-left");
      }, 150);
    }
  };

  const handleQuestionSelect = (index) => {
    if (index === currentQuestionIndex) return;

    setSlideDirection(index > currentQuestionIndex ? "left" : "right");
    setTimeout(() => {
      setCurrentQuestionIndex(index);
      setSlideDirection(index > currentQuestionIndex ? "in-right" : "in-left");
    }, 150);
  };

  const getSlideClass = () => {
    switch (slideDirection) {
      case "left":
        return "transform -translate-x-full transition-transform duration-300 ease-in-out";
      case "right":
        return "transform translate-x-full transition-transform duration-300 ease-in-out";
      case "in-right":
        return "transform translate-x-0 transition-transform duration-300 ease-in-out";
      case "in-left":
        return "transform translate-x-0 transition-transform duration-300 ease-in-out";
      default:
        return "";
    }
  };

  return (
    <Modal
      className="!w-full sm:!max-w-7xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl w-full max-w-7xl !px-0"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="relative ">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {isLoading ? (
          <div className="p-3 sm:p-6">
            <DetailedReportModalSkeleton />
          </div>
        ) : (
          <>
            {/* Sticky Header */}
            <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20 rounded-t-2xl sm:rounded-t-3xl">
              <div className="px-3 sm:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                      <ChartBarIcon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
                        Quiz Performance Report
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Review your quiz progress and detailed answers
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="cursor-pointer p-2 rounded-xl text-gray-600 dark:text-white hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-800 dark:hover:text-white transition-all duration-200 backdrop-blur-sm flex-shrink-0"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Card Details */}
                {cardData && (
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 dark:border-gray-700/20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      {/* Category */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm flex-shrink-0">
                          <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                            Category
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300 truncate">
                            {cardData.category}
                          </span>
                        </div>
                      </div>

                      {/* Main Topic */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                          <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            Main Topic
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 truncate">
                            {cardData["main-topic"]}
                          </span>
                        </div>
                      </div>

                      {/* Sub Topic */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                          <svg
                            className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                            Sub Topic
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 truncate">
                            {cardData["sub-topic"]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col">
              {isError && (
                <div className="flex items-center justify-center py-8 sm:py-16 px-3 sm:px-6">
                  <div className="text-center">
                    <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900/50 rounded-2xl inline-block mb-4">
                      <XMarkIcon className="h-8 w-8 sm:h-12 sm:w-12 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400">
                      Error fetching report data
                    </p>
                  </div>
                </div>
              )}

              {!isError && mergedReport.length === 0 && (
                <div className="flex items-center justify-center py-8 sm:py-16 px-3 sm:px-6">
                  <div className="text-center">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-lg inline-block mb-4 sm:mb-6">
                      <ChartBarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      No Report Data Available
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                      Complete some quizzes to see detailed performance
                      analytics
                    </p>
                  </div>
                </div>
              )}

              {!isError && mergedReport.length > 0 && (
                <>
                  {/* Sticky Navigation Only (No Stats) */}
                  <div className="sticky top-0 z-[100] bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 border-b border-white/20 dark:border-gray-700/20">
                    <div className="px-3 sm:px-6 py-3">
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/40 dark:border-gray-700/40 shadow-2xl">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                              currentQuestionIndex === 0
                                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </button>

                          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                              Question {currentQuestionIndex + 1} of{" "}
                              {mergedReport.length}
                            </span>

                            {/* Go to Question Dropdown */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setIsQuestionDropdownOpen(
                                    !isQuestionDropdownOpen
                                  )
                                }
                                className="cursor-pointer inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-xs sm:text-sm font-medium"
                              >
                                Go to Question
                                <ChevronDownIcon
                                  className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                                    isQuestionDropdownOpen ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              {isQuestionDropdownOpen && (
                                <div className="absolute top-10 sm:top-12 left-0 w-40 sm:w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[200] max-h-64 overflow-y-auto">
                                  <div className="py-2">
                                    {mergedReport.map((_, index) => (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          handleQuestionSelect(index);
                                          setIsQuestionDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                                          currentQuestionIndex === index
                                            ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                      >
                                        Question {index + 1}
                                        {currentQuestionIndex === index && (
                                          <CheckCircleIcon className="inline h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={handleNext}
                            disabled={
                              currentQuestionIndex === mergedReport.length - 1
                            }
                            className={`cursor-pointer p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                              currentQuestionIndex === mergedReport.length - 1
                                ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section (Separate from Navigation) */}
                  {currentQuestion && (
                    <div className="px-3 sm:px-6 py-4">
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                            <TrophyIcon className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Question Performance
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center border border-blue-200/50 dark:border-blue-700/50">
                            <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {currentQuestion.attempts}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Attempts
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3 text-center border border-green-200/50 dark:border-green-700/50">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              {currentQuestion.timesCorrect}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Correct
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-3 text-center border border-red-200/50 dark:border-red-700/50">
                            <XMarkIcon className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                              {currentQuestion.timesIncorrect || 0}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Incorrect
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-3 text-center border border-indigo-200/50 dark:border-indigo-700/50">
                            <ChartPieIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                              {currentQuestion.attempts > 0
                                ? `${Math.round(
                                    (currentQuestion.timesCorrect /
                                      currentQuestion.attempts) *
                                      100
                                  )}%`
                                : "N/A"}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Accuracy
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Question Content - Styled like QuizView */}
                  <div className="px-3 sm:px-6 pb-6 overflow-x-hidden">
                    {currentQuestion && (
                      <div className={`${getSlideClass()}`}>
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 dark:border-gray-700/30">
                          {/* Question Header */}
                          <div className="mb-6 sm:mb-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                                <QuestionMarkCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
                                  Question {currentQuestionIndex + 1}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                  Review the question and correct answer
                                </p>
                              </div>
                            </div>

                            {/* Question Content */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
                              <HtmlRenderer
                                className="!mt-0 text-base sm:text-lg text-gray-900 dark:text-white"
                                htmlContent={currentQuestion.question}
                              />
                            </div>
                          </div>

                          {/* Answer Options - Styled like QuizView */}
                          <div className="mb-6 sm:mb-8">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                              <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
                                <LightBulbIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                                  Answer Options
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                  The correct answer is highlighted
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:gap-4">
                              {shuffledOptions.map((option, i) => (
                                <div
                                  key={i}
                                  className={`relative rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-default ${
                                    option === currentQuestion.answer
                                      ? "bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 shadow-2xl"
                                      : "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                  }`}
                                >
                                  {/* Background decorative elements for correct answer */}
                                  {option === currentQuestion.answer && (
                                    <div className="absolute inset-0">
                                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                                    </div>
                                  )}

                                  <div className="relative z-10 p-4 sm:p-6 flex items-center">
                                    {/* Option Letter */}
                                    <div
                                      className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg mr-3 sm:mr-4 ${
                                        option === currentQuestion.answer
                                          ? "bg-white/20 text-white border-2 border-white/30"
                                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + i)}
                                    </div>

                                    {/* Option Content */}
                                    <div className="min-w-0 flex-1">
                                      <HtmlRenderer
                                        className={`!mt-0 text-sm sm:text-base leading-relaxed ${
                                          option === currentQuestion.answer
                                            ? "text-white"
                                            : "text-gray-800 dark:text-gray-200"
                                        }`}
                                        htmlContent={option}
                                      />
                                    </div>

                                    {/* Correct Answer Badge */}
                                    {option === currentQuestion.answer && (
                                      <div className="flex-shrink-0 ml-3 sm:ml-4">
                                        <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hint Text */}
                          <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2">
                              <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                              <p className="text-xs sm:text-sm font-medium">
                                Performance stats are shown above
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default DetailedReportModal;
