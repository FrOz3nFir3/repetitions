import React from "react";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import DeckProgressCard from "./DeckProgressCard";
import Pagination from "../../../components/ui/Pagination";
import { useGetUserStatsQuery } from "../../../api/apiSlice";
import useQuizProgressWithSearch from "../../../hooks/useQuizProgressWithSearch";
import EmptyState from "./ui/EmptyState";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import ProgressPageSkeleton from "../../../components/ui/skeletons/ProgressPageSkeleton";
import ProgressIndividualDeckListSkeleton from "../../../components/ui/skeletons/ProgressIndividualDeckListSkeleton";

const DeckProgressList = ({ user, onViewReport }) => {
  const CARDS_PER_PAGE = 6;

  // Use custom hook for search and pagination - exactly like PreviouslyStudied
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    cards: currentCards,
    total: totalItems,
    totalPages,
    isFetching,
    isLoading,
    isSearching,
    resetSearch,
  } = useQuizProgressWithSearch(user);

  //TODO: fix this later  Get stats for the summary (exclude stat count for deleted cards etc)
  const { data: stats } = useGetUserStatsQuery(undefined, {
    skip: !user?.studyingCount,
  });

  const totalDecksStudied = stats?.totalDecksStudied || 0;
  const totalQuizzesCompleted = stats?.totalQuizzesFinished || 0;

  // need to break this skeleton later
  if (isLoading) {
    return <ProgressPageSkeleton />;
  }

  if (!totalDecksStudied) {
    return (
      <EmptyState
        title="Ready to Start Learning?"
        message="Your learning journey begins with your first quiz. Choose a deck and start building your knowledge!"
        ctaText="Explore Learning Decks"
        ctaLink="/categories"
        icon={RocketLaunchIcon}
      />
    );
  }

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpenIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            Your Study Collection
          </span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Dive back into your decks and continue your learning journey.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="self-stretch relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <MagnifyingGlassIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <input
            type="text"
            placeholder="Search cards in your study decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
          />
          {searchQuery && (
            <button
              onClick={resetSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
          )}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {totalDecksStudied} active
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              {totalQuizzesCompleted} completed
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
        {isFetching ? (
          <ProgressIndividualDeckListSkeleton />
        ) : (
          <>
            {currentCards.length === 0 ? (
              <div className="text-center py-12">
                <BookOpenIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {isSearching ? "No cards found" : "No study cards yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {isSearching
                    ? `No cards match "${searchQuery}". Try a different search term.`
                    : "Start studying some cards to see your progress here."}
                </p>
                {isSearching && (
                  <button
                    onClick={resetSearch}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1  gap-8 md:grid-cols-2 xl:grid-cols-3">
                {currentCards.map((card, index) => {
                  return (
                    <DeckProgressCard
                      // TODO: make this card._id later
                      key={index}
                      card={card}
                      index={index}
                      onViewReport={onViewReport}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsCount={totalItems}
          itemsPerPage={CARDS_PER_PAGE}
          activeColorClass="bg-emerald-600"
        />
      )}
    </div>
  );
};

export default DeckProgressList;
