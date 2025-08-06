import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import DeckProgressCard from "./DeckProgressCard";
import Pagination from "../../../components/ui/Pagination";

const DeckProgressList = ({ user, studyingCards, onViewReport }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const filteredDecks = searchQuery.trim()
    ? user.studying.filter((_, index) => {
        const cardDetails = studyingCards[index];
        if (!cardDetails) return false;
        const searchLower = searchQuery.toLowerCase();
        return (
          cardDetails["main-topic"]?.toLowerCase().includes(searchLower) ||
          cardDetails["sub-topic"]?.toLowerCase().includes(searchLower) ||
          cardDetails.category?.toLowerCase().includes(searchLower)
        );
      })
    : user.studying;

  const CARDS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredDecks.length / CARDS_PER_PAGE);
  const startIndex = currentPage * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentCards = filteredDecks.slice(startIndex, endIndex);

  const totalDecksStudied = user.studying.length;
  const totalQuizzesCompleted = user.studying.reduce(
    (sum, deck) => sum + (deck["times-finished"] || 0),
    0
  );

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

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <MagnifyingGlassIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <input
            type="text"
            placeholder="Search your study decks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
          />
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {currentCards.map((progress, index) => {
            const actualIndex = user.studying.findIndex(
              (p) => p.card_id === progress.card_id
            );
            return (
              <div
                key={progress.card_id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DeckProgressCard
                  progress={progress}
                  cardDetails={studyingCards[actualIndex]}
                  onViewReport={onViewReport}
                />
              </div>
            );
          })}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsCount={filteredDecks.length}
          itemsPerPage={CARDS_PER_PAGE}
          activeColorClass="bg-emerald-600"
        />
      )}
    </div>
  );
};

export default DeckProgressList;
