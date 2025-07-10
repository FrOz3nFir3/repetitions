import React from "react";
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ name, stat, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg p-6 flex items-center">
    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
    </div>
    <div className="ml-5 w-0 flex-1">
      <dl>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
          {name}
        </dt>
        <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
          {stat}
        </dd>
      </dl>
    </div>
  </div>
);

const OverallStats = ({ user }) => {
  if (!user || !user.studying) return null;

  // --- All calculation logic is now contained within this component ---
  const totalDecksStudied = user.studying.length;
  const totalQuizzesTaken = user.studying.reduce(
    (acc, deck) => acc + (deck["times-started"] || 0),
    0
  );
  const totalCorrect = user.studying.reduce(
    (acc, deck) => acc + (deck["total-correct"] || 0),
    0
  );
  const totalIncorrect = user.studying.reduce(
    (acc, deck) => acc + (deck["total-incorrect"] || 0),
    0
  );
  const totalQuizzesFinished = user.studying.reduce(
    (acc, deck) => acc + (deck["times-finished"] || 0),
    0
  );
  const totalAnswers = totalCorrect + totalIncorrect;
  const overallAccuracy =
    totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
  const completionRate =
    totalQuizzesTaken > 0
      ? Math.round((totalQuizzesFinished / totalQuizzesTaken) * 100)
      : 0;

  const stats = [
    { name: "Decks Studied", stat: totalDecksStudied, icon: BookOpenIcon },
    {
      name: "Quizzes Taken",
      stat: totalQuizzesTaken,
      icon: QuestionMarkCircleIcon,
    },
    {
      name: "Overall Accuracy",
      stat: `${overallAccuracy}%`,
      icon: CheckCircleIcon,
    },
    {
      name: "Overall Completion",
      stat: `${completionRate}%`,
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
      {stats.map((item) => (
        <StatCard key={item.name} {...item} />
      ))}
    </div>
  );
};

export default OverallStats;
