import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
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
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
        Card Gallery
      </h3>
      <div className="flex items-center space-x-2 ">
        <button
          onClick={handlePrev}
          className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
        <div
          ref={containerRef}
          className="flex overflow-x-auto space-x-4 px-2 pb-2"
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
          className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronDoubleRightIcon className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default CardGallery;
