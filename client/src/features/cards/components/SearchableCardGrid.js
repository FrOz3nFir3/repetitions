import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
    <div>
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          placeholder="Search by Main Topic or Sub Topic"
          value={searchValue}
          onInput={handleSearchChange}
          disabled={cards.length === 0}
          className="p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
            No Cards Found
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {cards.length === 0
              ? "Create a new card to get started."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => (
            <CardDetails
              key={card._id}
              {...card}
              showCategory={showCategory}
              showContinue={showContinue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableCardGrid;
