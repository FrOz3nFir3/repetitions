import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FolderIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  PencilIcon,
  ChevronRightIcon,
  BookOpenIcon,
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
    <nav className="mb-6 overflow-hidden" aria-label="Breadcrumb">
      <div
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
        ref={containerRef}
      >
        <ol className="flex items-center space-x-1 sm:space-x-2 text-sm min-w-max pb-2">
          {/* Category Level */}
          <li className="flex items-center flex-shrink-0">
            <Link
              to={`/category/${cardData.category}`}
              className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
              title={`View all cards in ${
                cardData.categoryName || cardData.category
              } category`}
            >
              <FolderIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                {cardData.categoryName || `Category ${cardData.category}`}
              </span>
            </Link>
          </li>

          {/* Separator */}
          <li className="flex-shrink-0">
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </li>

          {/* Card Level */}
          <li className="flex items-center flex-shrink-0">
            {isDefaultView ? (
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                <DocumentTextIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                  {card.title || `Card Overview`}
                </span>
              </div>
            ) : (
              <Link
                to={`/card/${card._id}`}
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
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
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              </li>
              <li aria-current="page" className="flex-shrink-0">
                <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
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
