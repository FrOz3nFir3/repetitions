import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { SUPPORTED_LANGUAGES } from "./extensions";
import {
  getFavoriteLanguages,
  addToFavoriteLanguages,
  removeFromFavoriteLanguages,
  isLanguageFavorite,
} from "../../../utils/dom";

const LanguageSelector = ({ editor, currentLanguage = "plaintext" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load favorites on mount
  useEffect(() => {
    setFavorites(getFavoriteLanguages());
  }, []);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate favorites and non-favorites
  const favoriteLanguages = filteredLanguages.filter((lang) =>
    favorites.includes(lang.value)
  );

  const nonFavoriteLanguages = filteredLanguages.filter(
    (lang) => !favorites.includes(lang.value)
  );

  const currentLanguageLabel =
    SUPPORTED_LANGUAGES.find((lang) => lang.value === currentLanguage)?.label ||
    "Plain Text";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleLanguageSelect = (language) => {
    editor.chain().focus().setCodeBlockLanguage(language.value).run();
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggleFavorite = (languageValue, event) => {
    event.stopPropagation(); // Prevent language selection

    if (isLanguageFavorite(languageValue)) {
      const newFavorites = removeFromFavoriteLanguages(languageValue);
      setFavorites(newFavorites);
    } else {
      const newFavorites = addToFavoriteLanguages(languageValue);
      setFavorites(newFavorites);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (event.key === "Enter" && filteredLanguages.length > 0) {
      // Prioritize favorites for Enter key selection
      const firstLanguage =
        favoriteLanguages.length > 0
          ? favoriteLanguages[0]
          : filteredLanguages[0];
      handleLanguageSelect(firstLanguage);
    }
  };

  const renderLanguageOption = (language, isFavorite = false) => (
    <button
      key={language.value}
      type="button"
      onClick={() => handleLanguageSelect(language)}
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
        onClick={(e) => handleToggleFavorite(language.value, e)}
        className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0 cursor-pointer"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleFavorite(language.value, e);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors min-w-0"
        disabled={!editor.isEditable}
        title={`Current language: ${currentLanguageLabel}`}
      >
        <span className="font-medium truncate">{currentLanguageLabel}</span>
        <ChevronDownIcon
          className={`h-4 w-4 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 left-0 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              <>
                {/* Favorites Section */}
                {favoriteLanguages.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                      Favorites
                    </div>
                    {favoriteLanguages.map((language) =>
                      renderLanguageOption(language, true)
                    )}
                    {nonFavoriteLanguages.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                    )}
                  </>
                )}

                {/* All Languages Section */}
                {nonFavoriteLanguages.length > 0 && (
                  <>
                    {favoriteLanguages.length > 0 && (
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-700/50">
                        All Languages
                      </div>
                    )}
                    {nonFavoriteLanguages.map((language) =>
                      renderLanguageOption(language, false)
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No languages found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
