import React, { useState, useEffect, useRef, Suspense } from "react";
import { Link, NavLink } from "react-router-dom";
import { usePostAuthDetailsQuery } from "../../../api/apiSlice";
import {
  selectCurrentUser,
  initialUser,
} from "../../../features/authentication/state/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggler from "./ThemeToggler";
import ProfileMenuSkeleton from "./ProfileMenuSkeleton";

const ProfileMenu = React.lazy(() => import("./ProfileMenu"));
const MobileMenu = React.lazy(() => import("./MobileMenu"));

function Header() {
  const { data: existingUser, isLoading } = usePostAuthDetailsQuery();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (existingUser) {
      dispatch(initialUser(existingUser));
    }
  }, [existingUser, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const activeLinkStyle = {
    fontWeight: "bold",
    color: "#4f46e5",
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/category" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-12 w-auto"
                src="/images/logo.png"
                alt="Repetitions Logo"
              />
              <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">
                Repetitions
              </span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    style={({ isActive }) =>
                      isActive ? activeLinkStyle : undefined
                    }
                    className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="ml-auto mr-4 flex items-center">
            <ThemeToggler />
            {isLoading ? (
              <ProfileMenuSkeleton />
            ) : (
              <ProfileMenu
                user={user}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                profileMenuRef={profileMenuRef}
              />
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer inline-flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isOpen}
        navigation={navigation}
        activeLinkStyle={activeLinkStyle}
        user={user}
        setIsOpen={setIsOpen}
      />
    </nav>
  );
}

export default Header;
