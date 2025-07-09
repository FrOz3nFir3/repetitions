import React from "react";
import {
  useGetDetailedReportQuery,
  useGetIndividualCardQuery,
} from "../../api/apiSlice";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";

function DetailedReportModal({ card, isOpen, onClose }) {
  const {
    data: reportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
  } = useGetDetailedReportQuery(card.card_id, { skip: !isOpen });

  const {
    data: cardData,
    isLoading: isLoadingCard,
    isError: isErrorCard,
  } = useGetIndividualCardQuery(card.card_id, { skip: !isOpen });

  const isLoading = isLoadingReport || isLoadingCard;
  const isError = isErrorReport || isErrorCard;

  const mergedReport = React.useMemo(() => {
    if (!reportData || !cardData || !cardData.review) return [];

    const reviewMap = new Map(
      cardData.review.map((flashcard) => [flashcard.cardId, flashcard])
    );

    return reportData
      .map((attempt) => {
        const flashcardDetails = reviewMap.get(attempt.flashcard_id);
        if (!flashcardDetails) return null;

        return {
          ...attempt,
          question: flashcardDetails.question,
          answer: flashcardDetails.answer,
          options: flashcardDetails.options || [],
        };
      })
      .filter(Boolean);
  }, [reportData, cardData]);

  return (
    <Modal className="sm:!max-w-4xl" isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                {cardData?.category}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {cardData?.["main-topic"]}
              </h2>
              <p className="text-md text-gray-600 dark:text-gray-400">
                {cardData?.["sub-topic"]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
        </div>

        <div className="overflow-y-auto pr-2 max-h-[60vh]">
          {isLoading && <Loading />}
          {isError && (
            <p className="text-center text-red-500">
              Error fetching report data.
            </p>
          )}

          {!isLoading && !isError && (
            <div>
              {mergedReport.length > 0 ? (
                <ul className="space-y-6">
                  {mergedReport.map((item) => (
                    <li
                      key={item.flashcard_id}
                      className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-lg shadow-md"
                    >
                      <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                        {item.question}
                      </p>
                      <div className="mt-4 space-y-2">
                        {item.options.map((option, i) => (
                          <div
                            key={i}
                            className={`flex items-center p-3 rounded-md ${
                              option === item.answer
                                ? "bg-green-100 dark:bg-green-800/50"
                                : "bg-gray-100 dark:bg-gray-700/50"
                            }`}
                          >
                            {option === item.answer && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
                            )}
                            <span
                              className={`text-gray-700 dark:text-gray-300 ${
                                option === item.answer &&
                                "font-semibold text-green-800 dark:text-green-300"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-sm text-center">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Attempts
                          </p>
                          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                            {item.attempts}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Correct
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {item.timesCorrect}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Incorrect
                          </p>
                          <p className="font-bold text-red-600 dark:text-red-400 text-lg">
                            {item.timesIncorrect || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            Accuracy
                          </p>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                            {item.attempts > 0
                              ? `${Math.round(
                                  (item.timesCorrect / item.attempts) * 100
                                )}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No detailed report available for this card yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DetailedReportModal;
