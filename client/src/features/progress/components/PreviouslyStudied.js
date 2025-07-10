import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import SearchableCardGrid from "../../cards/components/SearchableCardGrid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import PreviouslyStudiedSkeleton from "../../../components/ui/skeletons/PreviouslyStudiedSkeleton";

const PreviouslyStudied = () => {
  const user = useSelector(selectCurrentUser);
  const { data: studyingCards, isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user,
    }
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  if (isLoading) {
    return <PreviouslyStudiedSkeleton />;
  }

  if (!user || !studyingCards || studyingCards?.length === 0) {
    return null;
  }

  const categories = [
    "All",
    ...new Set(studyingCards.map((card) => card.category)),
  ];

  const filteredCards =
    selectedCategory === "All"
      ? studyingCards
      : studyingCards.filter((card) => card.category === selectedCategory);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="my-8">
        <h3 className="text-3xl font-semi text-gray-900 dark:text-white sm:text-4xl">
          Revisit Your Studies
        </h3>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-300">
          Here are the cards you've studied before. Keep your knowledge sharp by
          reviewing them.
        </p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div ref={dropdownRef} className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedCategory}
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
          {isOpen && (
            <div className="absolute top-10  mt-2  rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleSelectCategory(category)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchableCardGrid cards={filteredCards} showCategory showContinue />
    </div>
  );
};

export default React.memo(PreviouslyStudied);
