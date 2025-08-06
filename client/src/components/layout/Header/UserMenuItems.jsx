import React from "react";
import { Link } from "react-router-dom";
import {
  UserIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import useLogout from "../../../hooks/useLogout";

const UserMenuItems = ({ isMobile = false, closeMenu = () => {} }) => {
  const handleLogout = useLogout();

  const commonLinkClasses = isMobile
    ? "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
    : "flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group";

  const commonIconClasses = isMobile
    ? "w-5 h-5"
    : "w-4 h-4 group-hover:scale-110 transition-transform duration-200";

  const SignOutButton = () => (
    <button
      onClick={() => handleLogout(closeMenu)}
      className={`cursor-pointer flex items-center space-x-3 w-full transition-all duration-300 ${
        isMobile
          ? "px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 group"
      }`}
    >
      <ArrowRightOnRectangleIcon
        className={
          isMobile
            ? "w-5 h-5"
            : "w-4 h-4 group-hover:scale-110 transition-transform duration-200"
        }
      />
      <span>Sign out</span>
    </button>
  );

  const links = (
    <>
      <Link to="/profile" onClick={closeMenu} className={commonLinkClasses}>
        <UserIcon className={commonIconClasses} />
        <span>Your Profile</span>
      </Link>
      <Link to="/progress" onClick={closeMenu} className={commonLinkClasses}>
        <ChartBarIcon className={commonIconClasses} />
        <span>Your Progress</span>
      </Link>
    </>
  );

  if (isMobile) {
    return (
      <div className="space-y-1">
        {links}
        <SignOutButton />
      </div>
    );
  }

  // Desktop
  return (
    <>
      <div className="py-2">{links}</div>
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 py-2">
        <SignOutButton />
      </div>
    </>
  );
};

export default UserMenuItems;
