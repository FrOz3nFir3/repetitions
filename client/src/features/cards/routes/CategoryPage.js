import React, { useState } from "react";
import { useGetAllCardsQuery } from "../../../api/apiSlice";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import CategorySkeleton from "../../../components/ui/skeletons/CategoryPageSkeleton";
import PreviouslyStudied from "../../progress/components/PreviouslyStudied";
import CreateCategoryCard from "../components/CreateCategoryCard";
import Modal from "../../../components/ui/Modal";
import {
  ArrowRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function CategoryPage() {
  const navigate = useNavigate();
  const { name: categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: allCards = [], isFetching: isFetchingAllCards } =
    useGetAllCardsQuery();

  const handleCategoryClick = (category) => {
    navigate(category);
    // Auto-scroll to CardsList section after navigation
    setTimeout(() => {
      const cardListElement = document.querySelector("[data-cardlist]");
      if (cardListElement) {
        cardListElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleCreateCategory = (categoryName) => {
    navigate(categoryName);
    setShowCreateForm(false);
  };

  const uniqueCategories = [...new Set(allCards)];

  // Filter categories based on search
  const filteredCategories = searchQuery.trim()
    ? uniqueCategories.filter((category) =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : uniqueCategories;

  // Pagination logic
  const CATEGORIES_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE);
  const startIndex = currentPage * CATEGORIES_PER_PAGE;
  const endIndex = startIndex + CATEGORIES_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  if (isFetchingAllCards) {
    return <CategorySkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <PreviouslyStudied />

        {/* Enhanced Header Section */}
        <div className="text-center my-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent pb-4">
            Pick a Category
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select a category to continue your learning journey or create a new
            one to organize your knowledge
          </p>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          {/* Enhanced Search and Create Bar */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8 p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <input
                type="text"
                placeholder="Search categories..."
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

            {/* Results Info and Create Button */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  {filteredCategories.length} of {uniqueCategories.length}
                  {searchQuery && " found"}
                </span>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5" />
                New Category
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
                <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {searchQuery ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No categories match "${searchQuery}". Try a different search term.`
                  : "Create your first category to start organizing your study materials."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create First Category
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentCategories.map((category, index) => (
                  <div
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl h-[180px] ${
                      categoryName === category
                        ? "bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-500 shadow-2xl"
                        : "bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {/* Background for non-selected cards */}
                    {categoryName !== category && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
                    )}

                    <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
                      <h3
                        className={`text-xl font-bold mb-4 transition-colors duration-300 line-clamp-2 ${
                          categoryName === category
                            ? "text-white drop-shadow-sm"
                            : "text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      >
                        {category}
                      </h3>

                      <div className="flex items-center gap-2 text-sm opacity-75 group-hover:opacity-100 transition-all duration-300">
                        <span
                          className={
                            categoryName === category
                              ? "text-white/90 drop-shadow-sm font-medium"
                              : "text-gray-600 dark:text-gray-400 font-medium"
                          }
                        >
                          View
                        </span>
                        <ArrowRightIcon
                          className={`h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 ${
                            categoryName === category
                              ? "text-white/90"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>

                      <div
                        className={`mt-4 w-12 h-1 rounded-full transition-all duration-300 ${
                          categoryName === category
                            ? "bg-white/70"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-16"
                        }`}
                      ></div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredCategories.length)} of{" "}
                    {filteredCategories.length} categories
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
                                  ? "bg-indigo-600 text-white shadow-lg"
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

        {/* Create Category Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          maxWidth="md"
        >
          <CreateCategoryCard
            onCreate={handleCreateCategory}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>

        <div className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
