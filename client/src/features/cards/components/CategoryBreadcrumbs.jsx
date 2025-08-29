import React from "react";
import { Link } from "react-router-dom";
import {
  RectangleStackIcon,
  ChevronRightIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FolderIcon as FolderIconSolid } from "@heroicons/react/24/solid";

const CategoryBreadcrumbs = ({ categoryName }) => {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (containerRef.current) {
      // scroll into active item (on mobile where there is overflow)
      const container = containerRef.current;
      container.scrollBy({
        left: container.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [categoryName]);

  // Don't render breadcrumb if no category name
  if (!categoryName) {
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
          {/* Home Level */}
          <li className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/50"
              title="Go to home page"
            >
              <HomeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Home</span>
            </Link>
          </li>

          {/* Separator */}
          <li className="flex-shrink-0">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </li>

          {/* Categories Level */}
          <li className="flex items-center flex-shrink-0">
            <Link
              to="/categories"
              className="group flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700/50"
              title="View all categories"
            >
              <RectangleStackIcon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">Categories</span>
            </Link>
          </li>

          {/* Separator */}
          <li className="flex-shrink-0">
            <ChevronRightIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </li>

          {/* Current Category Level - Highlighted */}
          <li aria-current="page" className="flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900/40 dark:to-purple-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
              <FolderIconSolid className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium truncate max-w-[120px] sm:max-w-xs">
                {categoryName}
              </span>
            </div>
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default React.memo(CategoryBreadcrumbs);
