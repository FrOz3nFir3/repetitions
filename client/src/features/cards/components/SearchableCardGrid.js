import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FaceFrownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import CardDetails from "./CardDetails";

const SearchableCardGrid = ({
  cards,
  showCategory = false,
  showContinue = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event) =>
    setSearchValue(event.target.value.toLowerCase());

  const filteredCards = searchValue.trim()
    ? cards.filter(
        (card) =>
          card["main-topic"].toLowerCase().includes(searchValue) ||
          card["sub-topic"].toLowerCase().includes(searchValue)
      )
    : cards;

  return (
    <div className="space-y-8">
      {/* Enhanced Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by main topic or sub topic..."
          value={searchValue}
          onInput={handleSearchChange}
          disabled={cards.length === 0}
          className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 text-lg"
        />
        {searchValue && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <button
              onClick={() => setSearchValue("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
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

      {/* Search Results Info */}
      {searchValue && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCards.length === 0
              ? "No cards match your search"
              : `Found ${filteredCards.length} card${
                  filteredCards.length !== 1 ? "s" : ""
                } matching "${searchValue}"`}
          </p>
        </div>
      )}

      {/* Cards Grid or Empty State */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
            {cards.length === 0 ? (
              <SparklesIcon className="h-10 w-10 text-gray-400" />
            ) : (
              <FaceFrownIcon className="h-10 w-10 text-gray-400" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            {cards.length === 0 ? "No Cards Yet" : "No Cards Found"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {cards.length === 0
              ? "Create your first card to start building your knowledge collection."
              : "Try adjusting your search terms or browse all available cards."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCards.map((card, index) => (
            <div
              key={card._id}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CardDetails
                {...card}
                showCategory={showCategory}
                showContinue={showContinue}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableCardGrid;
