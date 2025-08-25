import React from "react";
import { Link } from "react-router-dom";
import {
  PlayIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  TagIcon,
  FolderIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { HashtagIcon } from "@heroicons/react/24/solid";
import ProgressBar from "../../../components/ui/ProgressBar";
import StatBadge from "../../../components/ui/StatBadge";

const DeckProgressCard = ({ card, onViewReport, index }) => {
  const progress = {
    // TODO: change this later (key names)
    card_id: card._id,
    "times-started": card.timesStarted,
    "times-finished": card.timesFinished,
    "total-correct": card.totalCorrect,
    "total-incorrect": card.totalIncorrect,
  };

  const cardDetails = {
    _id: card._id,
    "main-topic": card["main-topic"],
    "sub-topic": card["sub-topic"],
    category: card.category,
  };

  // not valid data
  if (!cardDetails) {
    return null;
  }

  // Calculate stats
  const correct = progress["total-correct"] || 0;
  const incorrect = progress["total-incorrect"] || 0;
  const total = correct + incorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const timesStarted = progress["times-started"] || 0;
  const timesFinished = progress["times-finished"] || 0;
  const completion =
    timesStarted > 0 ? Math.round((timesFinished / timesStarted) * 100) : 0;

  // Determine performance level
  const getPerformanceLevel = () => {
    if (accuracy >= 90)
      return {
        level: "Excellent",
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
      };
    if (accuracy >= 75)
      return {
        level: "Good",
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
      };
    if (accuracy >= 60)
      return {
        level: "Fair",
        color: "text-yellow-600",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
      };
    return {
      level: "Needs Work",
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
    };
  };

  const performance = getPerformanceLevel();

  const notStarted = timesStarted === 0;

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="animate-fade-in group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl transition-all duration-500 group-hover:from-indigo-500/10 group-hover:to-purple-500/10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-xl"></div>
      {/* Header */}
      <div className="relative z-10 p-6 pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FolderIcon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Category
                </span>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 truncate">
                  {cardDetails.category}
                </span>
              </div>
            </div>

            {/* Main Topic */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <HashtagIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Main Topic
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                {cardDetails["main-topic"]}
              </h3>
            </div>

            {/* Sub Topic */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TagIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Sub Topic
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {cardDetails["sub-topic"]}
              </p>
            </div>
          </div>
          {/* Performance Badge */}
          <div
            className={`flex-shrink-0 ml-4 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap shadow-lg ${performance.bg} ${performance.color} border-2 border-white/50 dark:border-gray-700/50`}
          >
            <div className="flex items-center gap-1">
              {accuracy >= 90 ? (
                <StarIcon className="w-3 h-3" />
              ) : accuracy >= 75 ? (
                <TrophyIcon className="w-3 h-3" />
              ) : accuracy >= 60 ? (
                <SparklesIcon className="w-3 h-3" />
              ) : (
                <FireIcon className="w-3 h-3" />
              )}
              {performance.level}
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <ProgressBar
          label="Accuracy"
          value={accuracy}
          color="bg-gradient-to-r from-green-500 to-emerald-500"
        />
        <ProgressBar
          label="Completion"
          value={completion}
          color="bg-gradient-to-r from-indigo-500 to-purple-500"
        />

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatBadge
            label="Started"
            value={timesStarted}
            color="text-blue-600 dark:text-blue-400"
            icon={PlayIcon}
          />
          <StatBadge
            label="Finished"
            value={timesFinished}
            color="text-purple-600 dark:text-purple-400"
            icon={ClipboardDocumentCheckIcon}
          />
          <StatBadge
            label="Correct"
            value={correct}
            color="text-green-600 dark:text-green-400"
            icon={CheckCircleIcon}
          />
          <StatBadge
            label="Incorrect"
            value={incorrect}
            color="text-red-600 dark:text-red-400"
            icon={XCircleIcon}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 bg-gradient-to-r from-gray-50/80 to-indigo-50/80 dark:from-gray-700/50 dark:to-indigo-900/20 backdrop-blur-sm px-6 py-5 space-y-3 border-t border-gray-200/50 dark:border-gray-700/50">
        <Link
          to={`/card/${progress.card_id}/quiz`}
          className="group/btn w-full flex items-center justify-center px-5 py-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          <PlayIcon className="w-5 h-5 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
          {notStarted ? "Start Quiz" : "Continue Quiz"}
          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
        <button
          disabled={notStarted}
          onClick={() => onViewReport(progress)}
          className="cursor-pointer group/btn disabled:cursor-not-allowed disabled:opacity-30 w-full flex items-center justify-center px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg"
        >
          <ChartBarIcon className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
          View Detailed Report
        </button>
      </div>
    </div>
  );
};

export default DeckProgressCard;
