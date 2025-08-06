import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import StudiedCardGridItem from "../../cards/components/StudiedCardGridItem";
import Pagination from "../../../components/ui/Pagination";

const StudiedDecksGrid = ({
  paginatedCards,
  currentPage,
  totalPages,
  onPageChange,
  filteredCount,
  itemsPerPage,
}) => {
  if (filteredCount === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
          <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
          No cards found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedCards.map((card, index) => (
            <div
              key={card._id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <StudiedCardGridItem card={card} />
            </div>
          ))}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsCount={filteredCount}
        itemsPerPage={itemsPerPage}
        activeColorClass="bg-green-600"
      />
    </>
  );
};

export default StudiedDecksGrid;
