import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { Link } from "react-router-dom";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import ProgressPageSkeleton from "../../../components/ui/skeletons/ProgressPageSkeleton";
import DetailedReportModal from "../components/DetailedReportModal";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import OverallStats from "../components/OverallStats";
import DeckProgressCard from "../components/DeckProgressCard";
import {
  ChartBarIcon,
  TrophyIcon,
  SparklesIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function ProgressPage() {
  const user = useSelector(selectCurrentUser);
  const { data: studyingCards, isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user?.email,
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const handleViewReport = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  if (isLoading) {
    return <ProgressPageSkeleton />;
  }

  if (!user && !isLoading) {
    return (
      <RestrictedAccess description="You need to be logged in to view your progress and track your learning journey." />
    );
  }

  const totalDecksStudied = user.studying.length && studyingCards.length;
  const totalQuizzesCompleted = user.studying.reduce(
    (sum, deck) => sum + (deck["times-finished"] || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <ChartBarIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <StarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
                Your Learning Dashboard
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Welcome back,{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {user.name || user.email}
              </span>
              ! 🎯
              <br />
              <span className="text-lg">
                Track your progress, celebrate achievements, and continue your
                learning adventure.
              </span>
            </p>
          </div>

          {/* Overall Stats Component */}
          <div className="mb-12">
            <OverallStats user={user} />
          </div>

          {/* Decks Section */}
          <div className="mb-16">
            {/* Section Header */}
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
                Continue your learning journey with these carefully curated
                study decks
              </p>
            </div>

            {/* Enhanced Search and Stats Bar */}
            {totalDecksStudied > 0 && (
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                {/* Enhanced Search Bar */}
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
                  {searchQuery && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <button
                        onClick={() => setSearchQuery("")}
                        className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
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

                {/* Stats and Active Decks */}
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-4">
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
              </div>
            )}

            {totalDecksStudied > 0 ? (
              (() => {
                // Filter decks based on search query
                const filteredDecks = searchQuery.trim()
                  ? user.studying.filter((progress, index) => {
                      const cardDetails = studyingCards
                        ? studyingCards[index]
                        : null;
                      if (!cardDetails) return false;

                      const searchLower = searchQuery.toLowerCase();
                      return (
                        cardDetails["main-topic"]
                          ?.toLowerCase()
                          .includes(searchLower) ||
                        cardDetails["sub-topic"]
                          ?.toLowerCase()
                          .includes(searchLower) ||
                        cardDetails.category
                          ?.toLowerCase()
                          .includes(searchLower)
                      );
                    })
                  : user.studying;

                // Pagination logic
                const CARDS_PER_PAGE = 6;
                const totalPages = Math.ceil(
                  filteredDecks.length / CARDS_PER_PAGE
                );
                const startIndex = currentPage * CARDS_PER_PAGE;
                const endIndex = startIndex + CARDS_PER_PAGE;
                const currentCards = filteredDecks.slice(startIndex, endIndex);

                return filteredDecks.length > 0 ? (
                  <>
                    {/* Cards Grid */}
                    <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {currentCards.map((progress, index) => {
                          // Find the original index to get the correct cardDetails
                          const actualIndex = user.studying.findIndex(
                            (p) => p.card_id === progress.card_id
                          );
                          return (
                            <div
                              key={progress.card_id}
                              className="animate-fade-in"
                              style={{
                                animationDelay: `${index * 50}ms`,
                              }}
                            >
                              <DeckProgressCard
                                progress={progress}
                                cardDetails={
                                  studyingCards
                                    ? studyingCards[actualIndex]
                                    : null
                                }
                                onViewReport={handleViewReport}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Showing {startIndex + 1}-
                          {Math.min(endIndex, filteredDecks.length)} of{" "}
                          {filteredDecks.length} decks
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
                                        ? "bg-emerald-600 text-white shadow-lg"
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
                ) : (
                  <div className="text-center py-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      No decks found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Try adjusting your search criteria or clear the search to
                      see all decks.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Clear Search
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Start Learning?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  Your learning journey begins with your first quiz. Choose a
                  deck and start building your knowledge!
                </p>
                <Link
                  to="/category"
                  className="inline-flex items-center px-8 py-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <BookOpenIcon className="w-5 h-5 mr-2" />
                  Explore Learning Decks
                </Link>
              </div>
            )}
          </div>

          {/* Motivational Section */}
          {totalDecksStudied > 0 && (
            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-700">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  🎉 Keep Up the Great Work!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  You're actively studying{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {totalDecksStudied}
                  </span>{" "}
                  deck{totalDecksStudied !== 1 ? "s" : ""} and have completed{" "}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {totalQuizzesCompleted}
                  </span>{" "}
                  quizzes. Keep up the excellent work!
                </p>
                <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>Learning in Progress</span>
                  </div>
                  <div className="flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Stay Consistent</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedCard && (
        <DetailedReportModal
          isOpen={isModalOpen}
          cardId={selectedCard.card_id}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ProgressPage;
