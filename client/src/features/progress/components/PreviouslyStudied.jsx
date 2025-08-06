import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import {
  ChevronDownIcon,
  ClockIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import PreviouslyStudiedSkeleton from "../../../components/ui/skeletons/PreviouslyStudiedSkeleton";
import Pagination from "../../../components/ui/Pagination";
import StudiedCardGridItem from "../../cards/components/StudiedCardGridItem";
import useSearchAndPagination from "../../../hooks/useSearchAndPagination";

const CARDS_PER_PAGE = 9;

const studiedCardFilterFn = (card, query) =>
  card["main-topic"].toLowerCase().includes(query) ||
  card["sub-topic"].toLowerCase().includes(query) ||
  card.category.toLowerCase().includes(query);

const PreviouslyStudied = () => {
  const user = useSelector(selectCurrentUser);
  // CRITICAL FIX: Default studyingCards to an empty array `[]` to ensure hooks always receive valid data.
  const { data: studyingCards = [], isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user,
    }
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // This logic now correctly filters the data *before* it's passed to the pagination hook.
  const categoryFilteredCards = useMemo(() => {
    if (selectedCategory === "All") return studyingCards;
    return studyingCards.filter((card) => card.category === selectedCategory);
  }, [studyingCards, selectedCategory]);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: currentCards,
    filteredItemsCount,
  } = useSearchAndPagination(
    categoryFilteredCards,
    CARDS_PER_PAGE,
    studiedCardFilterFn
  );

  // This effect is now safe because the hook's internal logic will handle page resets correctly.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Early return for loading state must happen *after* all hooks are called.
  if (isLoading) {
    return <PreviouslyStudiedSkeleton />;
  }

  // Early return for no data state must also happen *after* hooks.
  if (!user || !studyingCards || studyingCards.length === 0) {
    return null;
  }

  const categories = [
    "All",
    ...new Set(studyingCards.map((card) => card.category)),
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg mb-6">
          <ClockIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent pb-4">
          Continue Learning
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Pick up where you left off and keep building your knowledge
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8 p-8 bg-white/70 dark:bg-gray-800/70 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MagnifyingGlassIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <input
            type="text"
            placeholder="Search your progress..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
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
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {studyingCards.length} total
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {filteredItemsCount} showing
              </span>
            </div>
          </div>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-sm px-4 py-2.5 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selectedCategory}</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="absolute right-0 top-14 w-48 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black/10 dark:ring-white/10 z-[100] border-2 border-gray-200 dark:border-gray-700">
                <div className="py-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleSelectCategory(category)}
                      className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        selectedCategory === category
                          ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {category}
                      {selectedCategory === category && (
                        <CheckCircleIcon className="inline h-4 w-4 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredItemsCount === 0 ? (
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
      ) : (
        <>
          <div className="bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl sm:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentCards.map((card, index) => (
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
            onPageChange={setCurrentPage}
            itemsCount={filteredItemsCount}
            itemsPerPage={CARDS_PER_PAGE}
            activeColorClass="bg-green-600"
          />
        </>
      )}
    </div>
  );
};

export default React.memo(PreviouslyStudied);
