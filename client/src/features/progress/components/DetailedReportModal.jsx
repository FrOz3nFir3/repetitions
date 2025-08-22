import React, { useState, useMemo } from "react";
import {
  useGetDetailedReportQuery,
  useGetIndividualCardQuery,
} from "../../../api/apiSlice";
import { XMarkIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import Modal from "../../../components/ui/Modal";
import DetailedReportModalSkeleton from "../../../components/ui/skeletons/DetailedReportModalSkeleton";
import ReportHeader from "./DetailedReport/ReportHeader";
import ReportNavigation from "./DetailedReport/ReportNavigation";
import ReportStats from "./DetailedReport/ReportStats";
import ReportContent from "./DetailedReport/ReportContent";

function DetailedReportModal({ cardId, isOpen, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");

  const {
    data: reportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
  } = useGetDetailedReportQuery(cardId, { skip: !isOpen });

  const {
    data: cardData,
    isLoading: isLoadingCard,
    isError: isErrorCard,
  } = useGetIndividualCardQuery(
    { id: cardId, view: "quiz" },
    { skip: !isOpen }
  );

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
            <ReportHeader cardData={cardData} onClose={onClose} />
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
                  <ReportNavigation
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onQuestionSelect={handleQuestionSelect}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={mergedReport.length}
                    report={mergedReport}
                  />
                  <ReportStats currentQuestion={currentQuestion} />
                  <ReportContent
                    currentQuestion={currentQuestion}
                    shuffledOptions={shuffledOptions}
                    slideClassName={getSlideClass()}
                    currentIndex={currentQuestionIndex}
                  />
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
