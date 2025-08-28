import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

const NavigationDropdown = ({
  items,
  currentIndex,
  onItemSelect,
  placeholder = "Go to item...",
  getItemLabel,
  getItemDescription,
  type = "item", // "flashcard" or "quiz"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (index) => {
    onItemSelect(index);
    setIsOpen(false);
  };

  const currentItem = items[currentIndex];
  const buttonText = currentItem
    ? getItemLabel(currentItem, currentIndex)
    : placeholder;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer flex items-center justify-between gap-3 px-4 py-3  text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl  focus:outline-none ${
          type === "quiz"
            ? `hover:border-pink-500 dark:hover:border-pink-400 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-4 focus:ring-pink-500/20`
            : `hover:border-indigo-500 dark:hover:border-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20`
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <span className="truncate">{buttonText}</span>
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <>
          {/* Backdrop */}
          {createPortal(
            <div
              className="fixed inset-0 z-1"
              onClick={() => setIsOpen(false)}
            />,
            document.body
          )}

          {/* Dropdown */}
          <div className="absolute top-34 lg:top-16 left-0 right-0 mt-2 z-[10000] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto ">
            {items.map((item, index) => (
              <button
                key={item._id || index}
                onClick={() => handleItemClick(index)}
                className={`cursor-pointer w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  index === currentIndex
                    ? `${
                        type === "quiz"
                          ? "bg-pink-50 dark:bg-pink-900/30 border-l-4 border-pink-500"
                          : "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500"
                      }`
                    : ""
                } ${index === 0 ? "rounded-t-xl" : ""} ${
                  index === items.length - 1 ? "rounded-b-xl" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {getItemLabel(item, index)}
                    </div>
                    {getItemDescription && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
                        {getItemDescription(item)}
                      </div>
                    )}
                  </div>
                  {index === currentIndex && (
                    <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationDropdown;
