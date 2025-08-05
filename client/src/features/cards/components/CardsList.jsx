import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCardsByCategoryQuery } from "../../../api/apiSlice";
import { NewCardForm } from "./NewCardForm";
import CardSkeleton from "../../../components/ui/skeletons/CardSkeleton";
import SearchableCardGrid from "./SearchableCardGrid";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import {
  BookOpenIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

const CardList = () => {
  const { name: category } = useParams();
  const { data = [], isFetching } = useGetCardsByCategoryQuery(category);
  const cardListRef = React.useRef(null);
  const params = useParams();
  const user = useSelector(selectCurrentUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  // Filter cards based on search
  const filteredCards = searchQuery.trim()
    ? data.filter(
        (card) =>
          card["main-topic"]
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          card["sub-topic"].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : data;

  // Pagination logic
  const CARDS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const startIndex = currentPage * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentCards = filteredCards.slice(startIndex, endIndex);

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

      {isFetching ? (
        <CardSkeleton />
      ) : (
        <div className="relative z-10 container mx-auto px-4">
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
              {data.length === 0
                ? "Start building your knowledge base by creating your first card"
                : `Explore ${data.length} card${
                    data.length !== 1 ? "s" : ""
                  } in this category`}
            </p>
          </div>

          {/* Enhanced Search and Action Bar */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
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
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {data.length} total
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {filteredCards.length} showing
                  </span>
                </div>
              </div>
              <NewCardForm category={category} newCard={data.length === 0} />
            </div>
          </div>

          {/* Cards Grid with Pagination */}
          {filteredCards.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
                {data.length === 0 ? (
                  <PlusIcon className="h-10 w-10 text-gray-400" />
                ) : (
                  <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {data.length === 0 ? "No cards yet" : "No cards found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {data.length === 0
                  ? "Create your first card to start building your knowledge collection."
                  : `No cards match "${searchQuery}". Try a different search term.`}
              </p>
              {data.length === 0 && (
                <NewCardForm category={category} newCard={true} />
              )}
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentCards.map((card, index) => (
                    <div
                      key={card._id}
                      className="animate-fade-in"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <Link to={`/card/${card._id}`} className="block">
                        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] h-full flex flex-col overflow-hidden cursor-pointer">
                          {/* Background decorative elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-full blur-2xl transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-indigo-600/10"></div>

                          <div className="relative z-10 p-6 flex-grow">
                            {/* Main Topic */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                                  <svg
                                    className="h-3 w-3 text-blue-600 dark:text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                    />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                  Main Topic
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {card["main-topic"]}
                              </h3>
                            </div>

                            {/* Sub Topic */}
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                                  <svg
                                    className="h-3 w-3 text-purple-600 dark:text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                  </svg>
                                </div>
                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                  Sub Topic
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-2">
                                {card["sub-topic"]}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="relative z-10 px-6 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <BookOpenIcon className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {card.review?.length || 0} Flashcard
                                  {(card.review?.length || 0) >= 1 ? "s" : ""}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all duration-300">
                                Explore
                                <svg
                                  className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 rounded-2xl transition-all duration-300"></div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredCards.length)} of{" "}
                    {filteredCards.length} cards
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(0, currentPage - 1))
                      }
                      disabled={currentPage === 0}
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i;
                          } else if (currentPage < 3) {
                            pageNum = i;
                          } else if (currentPage > totalPages - 4) {
                            pageNum = totalPages - 5 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`cursor-pointer w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(totalPages - 1, currentPage + 1)
                        )
                      }
                      disabled={currentPage === totalPages - 1}
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default CardList;
