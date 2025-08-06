import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  HomeIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import useLogout from "../../../hooks/useLogout";
import UserInfo from "./UserInfo";

const MobileMenu = ({ isOpen, navigation, user, setIsOpen }) => {
  const handleLogout = useLogout();

  const getNavIcon = (name) => {
    switch (name) {
      case "Home":
        return HomeIcon;
      case "Categories":
        return RectangleStackIcon;
      default:
        return HomeIcon;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-700/20 shadow-lg">
        {/* Navigation Links */}
        <div className="px-4 py-3 space-y-1">
          {navigation.map((item) => {
            const IconComponent = getNavIcon(item.name);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive ? "scale-110" : ""
                      } transition-transform duration-300`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Section */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-4">
          {user ? (
            <>
              {/* User Info */}
              <div className="px-4 py-3 mb-3 bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-xl">
                <UserInfo user={user} />
              </div>

              {/* User Menu Items */}
              <div className="space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Your Profile</span>
                </Link>

                <Link
                  to="/progress"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Your Progress</span>
                </Link>

                <button
                  onClick={() => handleLogout(setIsOpen)}
                  className="cursor-pointer flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/authenticate"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-base hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span>Register / Login</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
