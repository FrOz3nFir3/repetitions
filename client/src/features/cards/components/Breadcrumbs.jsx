import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FolderIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  PencilIcon,
  ChevronRightIcon,
  BookOpenIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const Breadcrumbs = ({ card, cardData }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const containerRef = React.useRef(null);

  // Get current activity for breadcrumb with icon and better naming
  const getCurrentActivity = () => {
    if (pathname.includes("/review")) {
      return {
        name: "Review Session",
        icon: BookOpenIcon,
      };
    }
    if (pathname.includes("/quiz")) {
      return {
        name: "Quiz Mode",
        icon: AcademicCapIcon,
      };
    }
    if (pathname.includes("/edit")) {
      return {
        name: "Edit Mode",
        icon: PencilIcon,
      };
    }
    return null;
  };

  const currentActivity = getCurrentActivity();

  const isDefaultView =
    location.pathname === `/card/${card?._id}` ||
    location.pathname === `/card/${card?._id}/`;

  React.useEffect(() => {
    if (containerRef.current) {
      // scroll into active item (on mobile where there is overflow)
      const container = containerRef.current;
      container.scrollBy({
        left: container.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [location]);

  // Don't render breadcrumb if no data
  if (!card || !cardData) {
    return null;
  }

  return (
    <nav className="mb-8 overflow-hidden" aria-label="Breadcrumb">
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        ref={containerRef}
      >
        <ol className="flex items-center space-x-1 sm:space-x-2 text-sm min-w-max pb-2 pt-2">
          {/* Home Level probably add this later? */}
          {/* <li className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/50"
              title="Go to home page"
            >
              <HomeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Home</span>
            </Link>
          </li> */}
          {/* Separator */}
          {/* <li className="flex-shrink-0">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </li> */}

          {/* Category Level */}
          <li className="flex items-center flex-shrink-0">
            <Link
              to={`/category/${cardData.category}`}
              className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/50"
              title={`View all cards in ${
                cardData.categoryName || cardData.category
              } category`}
            >
              <FolderIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-xs">
                {cardData.categoryName || `Category ${cardData.category}`}
              </span>
            </Link>
          </li>

          {/* Separator */}
          <li className="flex-shrink-0">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </li>

          {/* Card Level */}
          <li className="flex items-center flex-shrink-0">
            {isDefaultView ? (
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/40 dark:to-purple-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
                <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                  {card.title || `Card Overview`}
                </span>
              </div>
            ) : (
              <Link
                to={`/card/${card._id}`}
                className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/50"
                title="Return to card overview"
              >
                <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                  {card.title || `Card Overview`}
                </span>
              </Link>
            )}
          </li>

          {/* Activity Level */}
          {currentActivity && (
            <>
              <li className="flex-shrink-0">
                <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </li>
              <li aria-current="page" className="flex-shrink-0">
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/40 dark:to-purple-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
                  <currentActivity.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {currentActivity.name}
                  </span>
                </div>
              </li>
            </>
          )}
        </ol>
      </div>
    </nav>
  );
};

export default React.memo(Breadcrumbs);
