import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";

const LanguageOption = ({
  language,
  currentLanguage,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => (
  <button
    type="button"
    onClick={() => onSelect(language)}
    className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group ${
      language.value === currentLanguage
        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
        : "text-gray-700 dark:text-gray-300"
    }`}
  >
    <div className="flex-1 min-w-0">
      <div className="font-medium">
        <span className="truncate">{language.label}</span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {language.value}
      </div>
    </div>
    <div
      onClick={(e) => onToggleFavorite(language.value, e)}
      className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggleFavorite(language.value, e);
        }
      }}
    >
      {isFavorite ? (
        <StarIcon className="h-4 w-4 text-yellow-500 hover:text-yellow-600 cursor-pointer" />
      ) : (
        <StarOutlineIcon className="h-4 w-4 text-gray-400 hover:text-yellow-500 cursor-pointer" />
      )}
    </div>
  </button>
);

export default LanguageOption;
