import React from "react";
import { NavLink, Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { usePostLogoutUserMutation } from "../../../api/apiSlice";
import { useDispatch } from "react-redux";
import { initialUser } from "../../../features/authentication/state/authSlice";

const MobileMenu = ({
  isOpen,
  navigation,
  activeLinkStyle,
  user,
  setIsOpen,
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
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-gray-800">
      <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="cursor-pointer block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white"
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pb-3 pt-4">
        {user ? (
          <>
            <div className="flex items-center px-5">
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Link
                to="/progress"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white"
              >
                Your Progress
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <div className="px-2">
            <Link
              to="/authenticate"
              onClick={() => setIsOpen(false)}
              className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-indigo-700"
            >
              Login / Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
