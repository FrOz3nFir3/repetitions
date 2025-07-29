import React from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { usePostLogoutUserMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../../../features/authentication/state/authSlice";

const ProfileMenu = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  profileMenuRef,
}) => {
  const [logoutUser] = usePostLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      const gapi = import("gapi-script").then((module) => module.gapi);
      if (gapi.auth2) {
        const auth2 = gapi.auth2.getAuthInstance();
        if (auth2) {
          auth2.disconnect();
        }
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(initialUser({ user: null }));
      setIsProfileOpen(false);
    }
  };

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
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Signed in as
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group"
                  >
                    <UserIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Your Profile</span>
                  </Link>

                  <Link
                    to="/progress"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group"
                  >
                    <ChartBarIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Your Progress</span>
                  </Link>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 py-2">
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Sign out</span>
                  </button>
                </div>
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
