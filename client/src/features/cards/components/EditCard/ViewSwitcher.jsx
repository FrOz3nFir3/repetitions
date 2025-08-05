import React from "react";
import { BookOpenIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

const ViewSwitcher = ({
  view,
  setSearchParams,
  totalFlashcards,
  totalQuizzes,
}) => {
  const tabs = [
    {
      name: "Flashcards",
      view: "flashcards",
      icon: BookOpenIcon,
      count: totalFlashcards,
    },
    {
      name: "Quizzes",
      view: "quizzes",
      icon: AcademicCapIcon,
      count: totalQuizzes,
    },
  ];

  return (
    <div className="mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav
          className="-mb-px flex flex-wrap gap-2  sm:gap-6"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setSearchParams({ view: tab.view })}
              className={`cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${
                  view === tab.view
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                }
              `}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.name}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs font-medium ${
                  view === tab.view
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ViewSwitcher;
