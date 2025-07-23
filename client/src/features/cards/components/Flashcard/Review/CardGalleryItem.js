import React, { useEffect, useRef } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getTextFromHtml } from "../../../../../utils/dom";

const CardGalleryItem = ({
  item,
  isSelected,
  handleOnClick,
  isFilteredOut,
}) => {
  const buttonRef = useRef(null);

  // this causes auto scrolling down
  // useEffect(() => {
  //   if (isSelected && buttonRef.current) {
  //     buttonRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //       inline: "center",
  //     });
  //   }
  // }, [isSelected]);

  return (
    <button
      ref={buttonRef}
      onClick={handleOnClick}
      disabled={isFilteredOut}
      className={`group cursor-pointer flex-shrink-0 w-36 h-24 p-3 rounded-2xl text-left text-xs font-medium transition-all duration-300 relative overflow-hidden border-2
              ${
                isSelected
                  ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white shadow-2xl transform scale-105 border-blue-300"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
              }
              ${
                isFilteredOut ? "opacity-30 !cursor-not-allowed" : "opacity-100"
              }
            `}
    >
      {/* Background gradient for non-selected items */}
      {!isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs leading-tight line-clamp-4 text-center">
            {getTextFromHtml(item.question)}
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-0 right-0">
            <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
              <CheckCircleIcon className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default CardGalleryItem;
