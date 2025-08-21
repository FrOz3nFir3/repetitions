import React, { useState, useRef, Suspense } from "react";
import { useSelector } from "react-redux";
import { usePostAuthDetailsMutation } from "../../../api/apiSlice";
import { selectCurrentUser } from "../../../features/authentication/state/authSlice";

// Hooks
import useAuthEffect from "../../../hooks/useAuthEffect";
import useClickOutside from "../../../hooks/useClickOutside";
import useHeaderScroll from "../../../hooks/useHeaderScroll";

// Components
import ThemeToggler from "./ThemeToggler";
import ProfileMenuSkeleton from "../../ui/skeletons/ProfileMenuSkeleton";
import DesktopNav from "./DesktopNav";
import HeaderLogo from "./HeaderLogo";
import MobileMenuButton from "./MobileMenuButton";

const ProfileMenu = React.lazy(() => import("./ProfileMenu"));
const MobileMenu = React.lazy(() => import("./MobileMenu"));

function Header() {
  const [postAuthDetails, { isLoading }] = usePostAuthDetailsMutation();
  const user = useSelector(selectCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Custom Hooks for logic and side effects
  useAuthEffect(postAuthDetails);
  useClickOutside(profileMenuRef, () => setIsProfileOpen(false));
  const { isScrolled, isFocusedSession } = useHeaderScroll();

  const toggleMobileMenu = () => setIsOpen(!isOpen);

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
            <HeaderLogo />

            {/* Desktop Navigation */}
            <DesktopNav navigation={navigation} />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <ThemeToggler />
            {isLoading ? (
              <ProfileMenuSkeleton />
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
            <MobileMenuButton isOpen={isOpen} onClick={toggleMobileMenu} />
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
          isLoading={isLoading}
        />
      </Suspense>
    </nav>
  );
}

export default Header;
