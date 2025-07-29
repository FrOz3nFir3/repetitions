import React, { useState, useEffect, useRef, Suspense } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);

  // Check if current route is a focused session (review/quiz/edit)
  const isFocusedSession =
    location.pathname.includes("/review") ||
    location.pathname.includes("/quiz") ||
    location.pathname.includes("/edit");

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

  // Only add scroll listener when NOT in focused session
  useEffect(() => {
    if (!isFocusedSession) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(false); // Reset scroll state in focused sessions
    }
  }, [isFocusedSession]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/category" },
  ];

  return (
    <nav
      className={`${
        isFocusedSession ? "static" : "sticky"
      } top-0 z-50 transition-all duration-300 ${
        isFocusedSession
          ? "bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700"
          : isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <img
                  className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                  src="/images/logo.png"
                  alt="Repetitions Logo"
                />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                Repetitions
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                          : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <ThemeToggler />
            {isLoading ? (
              <Suspense fallback={<ProfileMenuSkeleton />}>
                <ProfileMenuSkeleton />
              </Suspense>
            ) : (
              <Suspense fallback={<ProfileMenuSkeleton />}>
                <ProfileMenu
                  user={user}
                  isProfileOpen={isProfileOpen}
                  setIsProfileOpen={setIsProfileOpen}
                  profileMenuRef={profileMenuRef}
                />
              </Suspense>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
      </div>

      {/* Mobile Menu */}
      <Suspense fallback={null}>
        <MobileMenu
          isOpen={isOpen}
          navigation={navigation}
          user={user}
          setIsOpen={setIsOpen}
        />
      </Suspense>
    </nav>
  );
}

export default Header;
