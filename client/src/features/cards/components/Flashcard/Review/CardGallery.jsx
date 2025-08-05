import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import CardGalleryItem from "./CardGalleryItem";

const CardGallery = ({
  review,
  filteredReview,
  currentFlashcard,
  handleCardSelect,
  searchTerm,
}) => {
  const containerRef = React.useRef(null);

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <RectangleStackIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Card Gallery
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick access to all your flashcards
          </p>
        </div>
      </div>

      <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="cursor-pointer flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
          </button>

          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-4 px-2 py-2 flex-1 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {review.map((item, index) => {
              const isSelected =
                filteredReview.length > 0 &&
                item.question === currentFlashcard?.question;
              const isFilteredOut =
                searchTerm &&
                !filteredReview.find((i) => i.question === item.question);

              const handleOnClick = () => {
                handleCardSelect(
                  filteredReview.findIndex((i) => i.question === item.question)
                );
              };

              return (
                <CardGalleryItem
                  key={index}
                  item={item}
                  isSelected={isSelected}
                  isFilteredOut={isFilteredOut}
                  handleOnClick={handleOnClick}
                />
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="cursor-pointer flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGallery;
