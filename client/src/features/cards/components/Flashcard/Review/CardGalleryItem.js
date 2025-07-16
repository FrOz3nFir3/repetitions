import React, { useEffect, useRef } from "react";
import { getTextFromHtml } from "../../../../../utils/dom";

const CardGalleryItem = ({
  item,
  isSelected,
  handleOnClick,
  isFilteredOut,
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isSelected && buttonRef.current) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [isSelected]);

  return (
    <button
      ref={buttonRef}
      onClick={handleOnClick}
      disabled={isFilteredOut}
      className={`shadow-lg cursor-pointer flex-shrink-0 w-32 h-20 p-2 rounded-lg text-left text-xs font-medium transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              }
              ${
                isFilteredOut ? "opacity-30 !cursor-not-allowed" : "opacity-100"
              }
            `}
    >
      <div className=" flex justify-center items-center h-full">
        <div className="text-xs line-clamp-4">
          {getTextFromHtml(item.question)}
        </div>
      </div>
    </button>
  );
};

export default CardGalleryItem;
