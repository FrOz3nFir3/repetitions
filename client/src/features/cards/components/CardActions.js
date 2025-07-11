import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  PencilSquareIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const ActionLink = ({ to, icon: Icon, children, baseBg, hoverBg }) => {
  const location = useLocation();
  const isActive = location.pathname.includes(to);

  const activeClass =
    "bg-gray-200 text-indigo-600 dark:bg-gray-700 dark:text-indigo-300";
  const inactiveClass = `text-white ${baseBg} ${hoverBg}`;

  const linkClass = isActive ? activeClass : inactiveClass;

  return (
    <Link
      to={to}
      className={`w-full text-center rounded-lg px-5 py-3 text-lg font-semibold shadow-sm flex items-center justify-center transition-colors duration-200 ${linkClass}`}
    >
      <Icon className="h-6 w-6 mr-2" />
      {children}
    </Link>
  );
};

const CardActions = ({ layout = "vertical" }) => {
  const layoutClasses = {
    vertical:
      "flex flex-col space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md",
    horizontal: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 ",
  };

  return (
    <div className={` ${layoutClasses[layout]}`}>
      <ActionLink
        to="review"
        icon={BookOpenIcon}
        baseBg="bg-indigo-600"
        hoverBg="hover:bg-indigo-700"
      >
        Review
      </ActionLink>
      <ActionLink
        to="quiz"
        icon={PencilSquareIcon}
        baseBg="bg-purple-600"
        hoverBg="hover:bg-purple-700"
      >
        Quiz
      </ActionLink>
      <ActionLink
        to="edit"
        icon={CogIcon}
        baseBg="bg-gray-600"
        hoverBg="hover:bg-gray-700"
      >
        Manage Flashcards
      </ActionLink>
    </div>
  );
};

export default CardActions;
