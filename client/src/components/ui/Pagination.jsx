import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
  activeColorClass = "bg-blue-600", // Default to blue
}) => {
  if (totalPages <= 1) return null;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, itemsCount);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    const pageNeighbours = 1; // Pages to show on each side of current page
    const totalNumbers = 3 + pageNeighbours * 2; // e.g., First, ..., Prev, Current, Next, ..., Last
    const totalBlocks = totalNumbers + 2; // Including ellipses

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const result = [];
    const startPage = 0;
    const endPage = totalPages - 1;

    const leftSiblingIndex = Math.max(currentPage - pageNeighbours, 1);
    const rightSiblingIndex = Math.min(
      currentPage + pageNeighbours,
      totalPages - 2
    );

    const shouldShowLeftDots = leftSiblingIndex > 1;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    result.push(startPage);

    if (shouldShowLeftDots) {
      result.push("...");
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      result.push(i);
    }

    if (shouldShowRightDots) {
      result.push("...");
    }

    result.push(endPage);
    return result;
  };

  const pageNumbers = getPageNumbers();

  const renderButton = (text, onClick, disabled = false, isIcon = false) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
        isIcon ? "w-10 h-10 !px-2" : ""
      }`}
    >
      {text}
    </button>
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="text-lg text-gray-600 dark:text-gray-400">
        Showing{" "}
        <strong>
          {startIndex + 1}-{endIndex}
        </strong>{" "}
        of {itemsCount} items
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {renderButton("First", () => handlePageChange(0), currentPage === 0)}
        {renderButton(
          <ChevronLeftIcon className="h-8 w-8" />,
          () => handlePageChange(currentPage - 1),
          currentPage === 0,
          true
        )}

        <div className="flex gap-1">
          {pageNumbers.map((pageNum, index) =>
            typeof pageNum === "string" ? (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 inline-flex items-center justify-center text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`cursor-pointer w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === pageNum
                    ? `${activeColorClass} text-white shadow-lg`
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum + 1}
              </button>
            )
          )}
        </div>

        {renderButton(
          <ChevronRightIcon className="h-8 w-8" />,
          () => handlePageChange(currentPage + 1),
          currentPage === totalPages - 1,
          true
        )}
        {renderButton(
          "Last",
          () => handlePageChange(totalPages - 1),
          currentPage === totalPages - 1
        )}
      </div>
    </div>
  );
};

export default Pagination;
