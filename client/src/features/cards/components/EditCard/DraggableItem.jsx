import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getTextFromHtml } from "../../../../utils/dom";
import {
  Bars3Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisHorizontalIcon,
  Bars4Icon,
} from "@heroicons/react/24/outline";

const DraggableItem = ({
  id,
  index,
  content,
  contentType,
  totalItems,
  onMoveToTop,
  onMoveToBottom,
  onMoveToPosition,
  onMoveUp,
  onMoveDown,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [targetPosition, setTargetPosition] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (showMenu) {
      setTimeout(() => {
        menuRef?.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu]);

  // Extract display text based on content type
  const displayText = React.useMemo(() => {
    if (contentType === "flashcards") {
      return getTextFromHtml(content.question || "");
    } else {
      return getTextFromHtml(content.quizQuestion || "");
    }
  }, [content, contentType]);

  const handlePositionSubmit = (e) => {
    e.preventDefault();
    const position = parseInt(targetPosition, 10);
    if (!isNaN(position) && position >= 1 && position <= totalItems) {
      onMoveToPosition(position);
      setTargetPosition("");
      setShowMenu(false);
    }
  };

  const handleMenuAction = (action) => {
    action();
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 ${
        isDragging
          ? "opacity-50 scale-[1.01] shadow-lg border-indigo-300 dark:border-indigo-600 z-50 cursor-not-allowed"
          : "hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4">
        {/* Drag Handle - Larger touch target for mobile */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 p-2 sm:p-1 -ml-1 sm:ml-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing transition-colors duration-200 touch-none"
          title="Drag to reorder"
        >
          <Bars3Icon className="h-6 w-6 sm:h-5 sm:w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex-shrink-0 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
              #{index + 1}
            </span>
            {/* have this expanded later based on click */}
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-4 leading-relaxed">
              {displayText || "No content available"}
            </p>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative flex-shrink-0">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="cursor-pointer p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="More actions"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"
            >
              <div className="py-1">
                {index > 0 && (
                  <button
                    onClick={() => handleMenuAction(onMoveUp)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                    Move Up
                  </button>
                )}

                {index < totalItems - 1 && (
                  <button
                    onClick={() => handleMenuAction(onMoveDown)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                    Move Down
                  </button>
                )}

                {(index > 0 || index < totalItems - 1) && (
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                )}

                {index > 0 && (
                  <button
                    onClick={() => handleMenuAction(onMoveToTop)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                    Move to Top
                  </button>
                )}

                {index < totalItems - 1 && (
                  <button
                    onClick={() => handleMenuAction(onMoveToBottom)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ArrowDownIcon className="h-4 w-4" />
                    Move to Bottom
                  </button>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                {/* Jump to Position */}
                <div className="px-4 py-2">
                  <form
                    onSubmit={handlePositionSubmit}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="number"
                      min="1"
                      max={totalItems}
                      placeholder="Position"
                      value={targetPosition}
                      onChange={(e) => setTargetPosition(e.target.value)}
                      className="flex-1 h-8 text-xs px-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={
                        !targetPosition ||
                        parseInt(targetPosition) === index + 1
                      }
                      className="cursor-pointer h-8 px-3 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dragging Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-lg border-2 border-dashed border-indigo-400 dark:border-indigo-500"></div>
      )}
    </div>
  );
};

export default DraggableItem;
