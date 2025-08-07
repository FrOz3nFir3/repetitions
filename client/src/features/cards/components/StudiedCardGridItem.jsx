import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClockIcon,
  CheckBadgeIcon,
  PlayIcon,
  ArrowPathIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

const StudiedCardGridItem = ({ card }) => {
  const navigate = useNavigate();
  const lastReviewedCardNo = card.lastReviewedCardNo ?? 0;
  const totalReviewCards = card.reviewLength ?? 0;
  const hasStarted = lastReviewedCardNo > 0;
  const isCompleted = hasStarted && lastReviewedCardNo >= totalReviewCards;
  const progressPercentage =
    totalReviewCards > 0 && hasStarted
      ? Math.round((lastReviewedCardNo / totalReviewCards) * 100)
      : 0;
  const continueReviewLink = isCompleted
    ? `/card/${card._id}/review`
    : hasStarted
    ? `/card/${card._id}/review?cardNo=${lastReviewedCardNo}`
    : `/card/${card._id}/review`;

  const handleQuizClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/card/${card._id}/quiz`);
  };

  return (
    <Link
      to={continueReviewLink}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col overflow-hidden block"
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-700">
            <CheckBadgeIcon className="h-3 w-3" />
            <span>Completed</span>
          </div>
        </div>
      )}

      {/* Progress Badge for In-Progress Cards */}
      {!isCompleted && totalReviewCards > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-700">
            <ClockIcon className="h-3 w-3" />
            <span>{hasStarted ? `${progressPercentage}%` : "Start"}</span>
          </div>
        </div>
      )}

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 group-hover:from-blue-500/10 group-hover:to-indigo-600/10 rounded-full blur-2xl transition-all duration-300"></div>

      <div className="relative z-10 p-6 flex-grow">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm">
            <svg
              className="h-3 w-3 text-white"
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
          <div className="flex flex-col">
            <span className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
              Category
            </span>
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              {card.category}
            </span>
          </div>
        </div>

        {/* Main Topic */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
              <svg
                className="h-3 w-3 text-blue-600 dark:text-blue-400"
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
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Main Topic
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {card["main-topic"]}
          </h3>
        </div>

        {/* Sub Topic */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
              <svg
                className="h-3 w-3 text-purple-600 dark:text-purple-400"
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
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Sub Topic
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2">
            {card["sub-topic"]}
          </p>
        </div>

        {/* Progress Bar for In-Progress Cards */}
        {!isCompleted && totalReviewCards > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>
                {hasStarted
                  ? `${lastReviewedCardNo} of ${totalReviewCards}`
                  : `0 of ${totalReviewCards}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50/50 to-gray-50/50 dark:from-gray-900/10 dark:to-gray-900/10">
        <div className="flex justify-between items-center gap-2">
          {isCompleted ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border-2 border-blue-200 dark:border-blue-700">
                <ArrowPathIcon className="h-4 w-4" />
                <span>Review Again</span>
              </div>
              <button
                onClick={handleQuizClick}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 text-sm font-semibold border-2 border-purple-200 dark:border-purple-700"
              >
                <AcademicCapIcon className="h-4 w-4" />
                <span>Take Quiz</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold border-2 border-blue-200 dark:border-blue-700">
                <PlayIcon className="h-4 w-4" />
                <span>{hasStarted ? "Continue" : "Start Review"}</span>
              </div>
              <button
                onClick={handleQuizClick}
                className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 text-sm font-semibold border-2 border-purple-200 dark:border-purple-700"
              >
                <AcademicCapIcon className="h-4 w-4" />
                <span>Take Quiz</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
    </Link>
  );
};

export default StudiedCardGridItem;
