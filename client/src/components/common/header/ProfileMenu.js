import React from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { usePostLogoutUserMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../../../features/authentication/authSlice";

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
      <div className="ml-4 flex items-center md:ml-6">
        {user ? (
          <div className="relative ml-3" ref={profileMenuRef}>
            <div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer flex max-w-xs items-center rounded-full bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400 hover:text-indigo-600" />
              </button>
            </div>
            {isProfileOpen && (
              <div className="absolute right-0 z-999 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                  Signed in as <br />
                  <span className="font-medium">{user.email}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/authenticate"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Login / Sign Up
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu;
