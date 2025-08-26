import React from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import CardGalleryItem from "./CardGalleryItem";
import SearchComponent from "./SearchComponent";
import NoSearchResults from "./NoSearchResults";
import { useCardGallerySearch } from "../../../hooks/useCardGallerySearch";

const CardGallery = ({
  review,
  isFlipped,
  currentFlashcard,
  handleCardSelect,
}) => {
  const scrollContainerRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const { searchTerm, filteredReview, handleSearchChange, handleSearchReset } =
    useCardGallerySearch(review);

  // Memoized index mapping to avoid findIndex calls
  const reviewIndexMap = React.useMemo(() => {
    const map = new Map();
    review.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [review]);

  const updateScrollButtons = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5); // Small threshold for better UX
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Small threshold
    }
  }, []);

  React.useEffect(() => {
    updateScrollButtons();
  }, [filteredReview, updateScrollButtons]);

  // Auto-scroll to selected card when currentFlashcard changes
  React.useEffect(() => {
    if (scrollContainerRef.current && currentFlashcard) {
      const selectedIndex = filteredReview.findIndex(
        (item) => item._id === currentFlashcard._id
      );

      if (selectedIndex !== -1) {
        const container = scrollContainerRef.current;
        const cardElements = container.children;
        const selectedCard = cardElements[selectedIndex];

        if (selectedCard) {
          const containerRect = container.getBoundingClientRect();
          const cardRect = selectedCard.getBoundingClientRect();

          // Check if card is not fully visible
          if (
            cardRect.left < containerRect.left ||
            cardRect.right > containerRect.right
          ) {
            const scrollLeft =
              selectedCard.offsetLeft -
              container.clientWidth / 2 +
              selectedCard.clientWidth / 2;
            container.scrollTo({
              left: Math.max(0, scrollLeft),
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [currentFlashcard, filteredReview]);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      // Also listen for resize to update when container size changes
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, [updateScrollButtons]);

  const handlePrev = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
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
        <SearchComponent
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchReset={handleSearchReset}
        />
      </div>

      <div className="relative">
        {/* Single Responsive Layout */}
        <div className="flex items-center gap-4">
          {/* Left Scroll Button - Desktop outside, Mobile overlaid */}
          <button
            onClick={handlePrev}
            title="Scroll cards left"
            disabled={filteredReview.length === 0 || !canScrollLeft}
            className="hidden sm:flex cursor-pointer flex-shrink-0 p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <ChevronDoubleLeftIcon className="h-4 w-4" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Scroll left
            </span>
          </button>

          {/* Cards Container */}
          <div className="flex-1 relative bg-gradient-to-r from-gray-50/80 via-white/80 to-gray-50/80 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg overflow-hidden">
            {filteredReview.length > 0 ? (
              <>
                {/* Mobile Scroll Buttons - Overlaid */}
                <button
                  onClick={handlePrev}
                  disabled={filteredReview.length === 0 || !canScrollLeft}
                  className="sm:hidden cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  <ChevronDoubleLeftIcon className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={filteredReview.length === 0 || !canScrollRight}
                  className="sm:hidden cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-20 disabled:cursor-not-allowed shadow-lg transition-all duration-200"
                >
                  <ChevronDoubleRightIcon className="h-3.5 w-3.5" />
                </button>

                {/* Scrollable Cards Area */}
                <div className="relative">
                  {/* Scroll Indicators - Responsive */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-6 bg-gradient-to-r from-white/60 to-transparent dark:from-gray-800/60 dark:to-transparent z-10 pointer-events-none sm:block hidden"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-6 bg-gradient-to-l from-white/60 to-transparent dark:from-gray-800/60 dark:to-transparent z-10 pointer-events-none sm:block hidden"></div>

                  {/* Mobile scroll indicators */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white/40 to-transparent dark:from-gray-800/40 dark:to-transparent z-10 pointer-events-none sm:hidden"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white/40 to-transparent dark:from-gray-800/40 dark:to-transparent z-10 pointer-events-none sm:hidden"></div>

                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 sm:gap-4 gap-3 p-6 sm:p-6 p-4 scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {filteredReview.map((item, index) => {
                      let isSelected = item._id === currentFlashcard._id;

                      const handleOnClick = () => {
                        if (!searchTerm?.trim()) {
                          handleCardSelect(index);
                        } else {
                          // Use memoized index map instead of findIndex
                          const reviewIndex = reviewIndexMap.get(item._id);
                          if (reviewIndex !== undefined) {
                            handleCardSelect(reviewIndex);
                          }
                        }
                      };

                      return (
                        <CardGalleryItem
                          key={item.question}
                          item={item}
                          isFlipped={isFlipped}
                          isSelected={isSelected}
                          isFilteredOut={false}
                          handleOnClick={handleOnClick}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Scroll Hint - Responsive */}
                <div className="px-6 pb-3">
                  <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="hidden sm:inline">
                      Click cards to select • Use arrow buttons to scroll
                    </span>
                    <span className="sm:hidden">
                      Tap cards to select • Swipe to scroll
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <NoSearchResults />
            )}
          </div>

          {/* Right Scroll Button - Desktop only */}
          <button
            onClick={handleNext}
            title="Scroll cards right"
            disabled={filteredReview.length === 0 || !canScrollRight}
            className="hidden sm:flex cursor-pointer flex-shrink-0 p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <ChevronDoubleRightIcon className="h-4 w-4" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Scroll right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGallery;
