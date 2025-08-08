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
      title={`Click to select: ${getTextFromHtml(item.question).substring(
        0,
        50
      )}...`}
      className={`group cursor-pointer flex-shrink-0 w-40 h-28 p-4 rounded-xl text-left text-xs font-medium transition-all duration-300 relative overflow-hidden border-2 hover:scale-[1.02] active:scale-[0.98]
              ${
                isSelected
                  ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white shadow-xl border-blue-400 ring-2 ring-blue-300/50"
                  : "bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg border-gray-200/60 dark:border-gray-600/60 hover:border-indigo-300 dark:hover:border-indigo-500"
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
