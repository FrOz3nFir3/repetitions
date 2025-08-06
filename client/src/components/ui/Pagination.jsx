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

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    startPage = 0;
    endPage = totalPages - 1;
  } else {
    if (currentPage <= 2) {
      startPage = 0;
      endPage = maxPagesToShow - 1;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - maxPagesToShow;
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {startIndex + 1}-{endIndex} of {itemsCount} items
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Previous
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((pageNum) => (
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
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
