import React from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import UserInfo from "./UserInfo";
import UserMenuItems from "./UserMenuItems";

const ProfileMenu = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  profileMenuRef,
}) => {
  const closeMenu = () => setIsProfileOpen(false);
  return (
    <div className="hidden md:block">
      {user ? (
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="cursor-pointer flex items-center space-x-2 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
          >
            <div className="relative">
              <UserCircleIcon className="h-7 w-7 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <span className="text-sm font-medium max-w-24 truncate">
              {user.name}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-3 w-64 origin-top-right">
              <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <UserInfo user={user} />
                </div>

                {/* Menu Items */}
                <UserMenuItems isMobile={false} closeMenu={closeMenu} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/authenticate"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <span>Login / Register </span>
        </Link>
      )}
    </div>
  );
};

export default ProfileMenu;
