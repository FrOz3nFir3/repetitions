import React, { useState, lazy } from "react";
import {
  ArrowPathIcon,
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

const DetailedReportModal = lazy(() =>
  import("../../../progress/components/DetailedReportModal")
);

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-purple-200/50 dark:border-purple-700/50 text-center group hover:shadow-2xl transition-all duration-300">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const QuizResults = ({ score, totalQuestions, onRestart, cardId }) => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const incorrect = totalQuestions - score;
  const hasStrugglingQuestions = incorrect > 0;

  const handleFocusQuiz = () => {
    navigate(`/card/${cardId}/focus-quiz`);
  };

  const getPerformanceMessage = () => {
    if (percentage === 100) return "Flawless Victory!";
    if (percentage >= 80) return "Excellent Work!";
    if (percentage >= 60) return "Good Job!";
    if (percentage >= 40) return "Keep Practicing!";
    return "You can do better!";
  };

  const getPerformanceIcon = () => {
    if (percentage >= 80) return TrophyIcon;
    return SparklesIcon;
  };

  const PerformanceIcon = getPerformanceIcon();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 sm:p-12 text-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent mb-4">
            {getPerformanceMessage()}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You have completed the quiz successfully
          </p>
        </div>

        {/* Score Circle */}
        <div className="mb-10 flex justify-center items-center">
          <div className="relative w-56 h-56">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className="text-purple-600"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${
                  2 * Math.PI * 42 * (1 - percentage / 100)
                }`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                style={{
                  transition: "stroke-dashoffset 1.5s ease-out",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {Math.round(percentage)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Final Score
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Questions"
            value={totalQuestions}
            color="text-gray-800 dark:text-white"
          />
          <StatCard
            label="Correct Answers"
            value={score}
            color="text-green-500"
          />
          <StatCard
            label="Incorrect Answers"
            value={incorrect}
            color="text-red-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onRestart}
            className="cursor-pointer group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <ArrowPathIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
            Take Quiz Again
          </button>
          
          {user && hasStrugglingQuestions && (
            <button
              onClick={handleFocusQuiz}
              className="cursor-pointer group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <FireIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Focus on Difficult Questions
            </button>
          )}
          
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-purple-600 dark:text-purple-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ChartBarIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              View Detailed Report
            </button>
          )}
        </div>

        {isModalOpen && (
          <DetailedReportModal
            isOpen={isModalOpen}
            cardId={cardId}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default QuizResults;
