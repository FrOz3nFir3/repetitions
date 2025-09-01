import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiSlice } from "../../../../api/apiSlice";
import {
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const FocusQuizCompletion = ({
  score,
  totalQuestions,
  completedQuizzesCount,
  totalFocusQuizzes,
  restartFocusQuiz,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Use totalFocusQuizzes for accuracy calculation since that's the actual quiz count
  const accuracyPercentage =
    totalFocusQuizzes > 0 ? (score / totalFocusQuizzes) * 100 : 0;
  const isHighScore = accuracyPercentage >= 80;
  const isPerfectScore = accuracyPercentage === 100;

  const handleTakeRegularQuiz = () => {
    navigate(`/card/${id}/quiz`);
  };

  const handleRetryFocusQuiz = () => {
    // Invalidate focus quiz cache to refetch latest data
    dispatch(
      apiSlice.util.invalidateTags([
        { type: "FocusQuizData", id: id },
        { type: "FocusQuizData", id: "LIST" },
      ])
    );

    // Reset the focus quiz state
    restartFocusQuiz();
  };

  const handleGoToOverview = () => {
    navigate(`/card/${id}`);
  };

  return (
    <div className="text-center py-12">
      {/* Achievement Badge */}
      <div className="relative inline-block mb-8">
        <div
          className={`p-6 rounded-3xl shadow-2xl ${
            isPerfectScore
              ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600"
              : isHighScore
              ? "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700"
              : "bg-gradient-to-br from-red-500 via-orange-600 to-pink-700"
          }`}
        >
          {isPerfectScore ? (
            <TrophyIcon className="h-16 w-16 text-white mx-auto" />
          ) : isHighScore ? (
            <CheckCircleIcon className="h-16 w-16 text-white mx-auto" />
          ) : (
            <FireIcon className="h-16 w-16 text-white mx-auto" />
          )}
        </div>
        {isPerfectScore && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-xl">🏆</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h2
        className={`text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
          isPerfectScore
            ? "from-yellow-600 via-amber-700 to-orange-800 dark:from-yellow-300 dark:via-amber-400 dark:to-orange-500"
            : isHighScore
            ? "from-green-600 via-emerald-700 to-teal-800 dark:from-green-300 dark:via-emerald-400 dark:to-teal-500"
            : "from-red-600 via-orange-700 to-pink-800 dark:from-red-300 dark:via-orange-400 dark:to-pink-500"
        }`}
      >
        {isPerfectScore
          ? "🎉 Perfect Score!"
          : isHighScore
          ? "🌟 Great Job!"
          : "💪 Keep Practicing!"}
      </h2>

      {/* Score Display */}
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ChartBarIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Score
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {score}/{totalFocusQuizzes}
            </div>
            <div
              className={`text-sm font-medium ${
                isHighScore
                  ? "text-green-600 dark:text-green-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {Math.round(accuracyPercentage)}% Accuracy
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FireIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {completedQuizzesCount}/{totalFocusQuizzes}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Questions Practiced
            </div>
          </div>
        </div>
      </div>

      {/* Performance Message */}
      <div className="mb-8">
        {isPerfectScore ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Outstanding! You've mastered these challenging questions. Your focus
            and dedication have paid off!
          </p>
        ) : isHighScore ? (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Excellent work! You're showing great improvement on these difficult
            questions. Keep up the momentum!
          </p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Don't give up! These questions are challenging for a reason. Each
            attempt makes you stronger. Try again!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 max-w-sm mx-auto">
        {/* Only show retry button if accuracy is not 100% */}
        {accuracyPercentage < 100 && (
          <button
            onClick={handleRetryFocusQuiz}
            className="cursor-pointer w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Retry Focus Quiz
          </button>
        )}

        <button
          onClick={handleTakeRegularQuiz}
          className="cursor-pointer w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Take Regular Quiz
        </button>

        <button
          onClick={handleGoToOverview}
          className="cursor-pointer w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200"
        >
          Back to Overview
        </button>
      </div>
    </div>
  );
};

export default FocusQuizCompletion;
