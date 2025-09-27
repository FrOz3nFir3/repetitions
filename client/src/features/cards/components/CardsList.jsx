import React from "react";
import { useParams } from "react-router-dom";
import { NewCardForm } from "./NewCardForm";
import CardSkeleton from "../../../components/ui/skeletons/CardSkeleton";
import Pagination from "../../../components/ui/Pagination";
import CardGridItem from "./CardGridItem";
import useCardsWithSearch from "../../../hooks/useCardsWithSearch";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { normalizeCategory } from "../../../utils/textNormalization";

const CardList = () => {
  let { name: category } = useParams();
  category = normalizeCategory(category);
  const cardListRef = React.useRef(null);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    cards,
    total: totalItemsCount,
    totalPages,
    isFetching,
    isLoading,
    isSearching,
  } = useCardsWithSearch(category);

  const filteredItemsCount = cards.length;

  return (
    <div
      ref={cardListRef}
      data-cardlist
      className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-slate-900/50 dark:to-indigo-950/30 py-16"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/5 to-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto 2xl:max-w-7xl p-4">
        {/* Enhanced Header Section */}
        <div className="text-center mb-12">
          {/* Category Badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
              <FolderIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Category
              </span>
              <span className="break-word text-xl font-bold text-blue-700 dark:text-blue-300">
                {category}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent pb-4">
            Card Collection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {isFetching ? (
              <span className="bg-gray-200 h-6 animate-pulse"></span>
            ) : (
              <>
                {totalItemsCount === 0
                  ? "Start building your knowledge base by creating your first card"
                  : `Explore ${totalItemsCount} card${
                      totalItemsCount !== 1 ? "s" : ""
                    } in this category`}
              </>
            )}
          </p>
        </div>

        {/* Enhanced Search and Action Bar */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          {/* Enhanced Search Bar */}
          <div className="self-stretch relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search cards in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Stats and Create Button */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                {isFetching ? (
                  <div className="h-4 w-10 bg-gray-200 animate-pulse"> </div>
                ) : (
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {totalItemsCount} total
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {isFetching ? (
                  <div className="h-4 w-10 bg-gray-200 animate-pulse"> </div>
                ) : (
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {filteredItemsCount} showing
                  </span>
                )}
              </div>
            </div>
            <NewCardForm category={category} />
          </div>
        </div>

        {/* Cards Grid with Pagination */}
        {!(isLoading || isFetching) && filteredItemsCount === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
              {totalItemsCount === 0 ? (
                <PlusIcon className="h-10 w-10 text-gray-400" />
              ) : (
                <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {totalItemsCount === 0 ? "No cards yet" : "No cards found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              {totalItemsCount === 0
                ? "Create your first card to start building your knowledge collection."
                : `No cards match "${searchQuery}". Try a different search term.`}
            </p>
            {totalItemsCount === 0 && <NewCardForm category={category} />}
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            {isFetching || isLoading ? (
              <CardSkeleton showHeader={false} />
            ) : (
              <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cards.map((card, index) => (
                    <div
                      key={card._id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardGridItem card={card} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsCount={totalItemsCount}
                itemsPerPage={9}
                activeColorClass="bg-indigo-600"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default CardList;
