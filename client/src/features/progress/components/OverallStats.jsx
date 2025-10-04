import React from "react";
import {
  BookOpenIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../../../components/ui/StatCard";
import { useGetUserStatsQuery } from "../../../api/apiSlice";

const OverallStatsSkeleton = () => {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
};

const OverallStats = ({ user }) => {
  const { data: statsData, isLoading } = useGetUserStatsQuery(undefined, {
    skip: !user?.email,
  });

  if (!user) return null;
  if (isLoading) return <OverallStatsSkeleton />;
  if (!statsData) return null;

  const {
    totalDecksStudied,
    totalQuizzesTaken,
    totalCorrect,
    totalIncorrect,
    totalQuizzesFinished,
    overallAccuracy,
    completionRate,
  } = statsData;

  const totalAnswers = totalCorrect + totalIncorrect;

  const stats = [
    {
      name: "Learning Decks",
      stat: totalDecksStudied,
      icon: BookOpenIcon,
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
      description: "Active study collections you're working on",
      trend: totalDecksStudied > 3 ? "Great variety!" : null,
    },
    {
      name: "Accuracy Rate",
      stat: `${overallAccuracy}%`,
      icon: TrophyIcon,
      gradient: "bg-gradient-to-r from-yellow-500 to-orange-500",
      description: `${totalCorrect} correct answers from ${totalAnswers} total attempts`,
      trend:
        overallAccuracy > 75
          ? "Excellent!"
          : overallAccuracy > 50
          ? "Good progress"
          : null,
    },
    {
      name: "Quiz Sessions",
      stat: totalQuizzesTaken,
      icon: PlayCircleIcon,
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "Total practice sessions started",
      trend:
        totalQuizzesTaken > 10
          ? "Very active!"
          : totalQuizzesTaken > 5
          ? "Good practice"
          : null,
    },
    {
      name: "Completion Rate",
      stat: `${completionRate}%`,
      icon: ChartBarIcon,
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500",
      description: `${totalQuizzesFinished} sessions finished out of ${totalQuizzesTaken} started`,
      trend:
        completionRate > 80
          ? "Consistent!"
          : completionRate > 60
          ? "Good follow-through"
          : null,
    },
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your Learning Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Detailed insights into your study patterns and progress
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {stats.map((item) => (
          <StatCard key={item.name} {...item} />
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Learning Progress Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              You've studied{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {totalDecksStudied}
              </span>{" "}
              decks with an average accuracy of{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {overallAccuracy}%
              </span>
              . Keep up the great work!
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalQuizzesTaken}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Quizzes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalCorrect}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Correct
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStats;
