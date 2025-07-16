import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  PencilSquareIcon,
  CogIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export const ActionLink = ({ to, icon: Icon, children, baseBg, hoverBg }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(to);

  const baseClasses =
    "w-full rounded-lg px-5 py-4 text-lg font-semibold shadow-lg flex items-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl cursor-pointer";

  const activeClasses =
    "hover:cursor-not-allowed hover:translate-none bg-white text-gray-800 dark:bg-gray-700 dark:text-white ring-4 ring-blue-500 dark:ring-blue-400 scale-102";
  const inactiveClasses = `text-white ${baseBg} ${hoverBg}`;

  const linkClasses = isActive
    ? `${baseClasses} ${activeClasses}`
    : `${baseClasses} ${inactiveClasses}`;

  return (
    <Link to={to} className={linkClasses}>
      <div className="w-8 flex-shrink-0">
        <Icon className="h-6 w-6" />
      </div>
      <span className="flex-grow text-center">{children}</span>
    </Link>
  );
};

const CardActions = ({ layout = "vertical", showInfo = false }) => {
  const layoutClasses = {
    vertical:
      "flex flex-col space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md",
    horizontal: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2",
  };

  return (
    <div className={`${layoutClasses[layout]}`}>
      {showInfo && (
        <div className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm flex items-center justify-center">
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          Select an activity to begin.
        </div>
      )}
      <ActionLink
        to="review"
        icon={BookOpenIcon}
        baseBg="bg-gradient-to-r from-blue-500 to-indigo-600"
        hoverBg="hover:from-blue-600 hover:to-indigo-700"
      >
        Review
      </ActionLink>
      <ActionLink
        to="quiz"
        icon={PencilSquareIcon}
        baseBg="bg-gradient-to-r from-purple-500 to-pink-600"
        hoverBg="hover:from-purple-600 hover:to-pink-700"
      >
        Quiz
      </ActionLink>
      <ActionLink
        to="edit"
        icon={CogIcon}
        baseBg="bg-gradient-to-r from-gray-600 to-gray-800"
        hoverBg="hover:from-gray-700 hover:to-gray-900"
      >
        Edit Flashcards
      </ActionLink>
    </div>
  );
};

export default CardActions;
