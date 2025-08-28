import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { createPortal } from "react-dom";

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const selectedOption = useMemo(() => {
    const found = options.find((opt) => opt.value === value);
    return found;
  }, [options, value]);

  // Update search term when the selection changes externally
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [selectedOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        // If dropdown is closed without selection, revert to selected option's text
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        } else {
          setSearchTerm("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedOption]);

  const handleSelect = (option) => {
    onChange(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation(); // Prevent the dropdown from opening
    onChange(null);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const filteredOptions = useMemo(
    () =>
      options.filter((option) => {
        if (!searchTerm) return true;
        // When a user is typing, we should still allow them to search
        if (searchTerm !== selectedOption?.label || "") {
          const labelText = option.label.toLowerCase();
          const descriptionText = option.description
            ? option.description.toLowerCase()
            : "";
          const searchTermLower = searchTerm.toLowerCase();

          return (
            labelText.includes(searchTermLower) ||
            descriptionText.includes(searchTermLower)
          );
        }
        // If a selection is made, searchTerm will match the label,
        // but we should still show all options so the user can change their selection
        return true;
      }),
    [options, searchTerm, selectedOption]
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          {value ? (
            <button
              onClick={handleClear}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Clear selection"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          ) : (
            <ChevronDownIcon
              className="h-4 w-4 text-gray-500 flex-shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      {isOpen && (
        <>
          {/* Backdrop */}
          {createPortal(
            <div
              className="fixed inset-0 z-1"
              onClick={() => {
                setIsOpen(false);
                // If dropdown is closed without selection, revert to selected option's text
                if (selectedOption) {
                  setSearchTerm(selectedOption.label);
                } else {
                  setSearchTerm("");
                }
              }}
            />,
            document.body
          )}

          {/* Dropdown */}
          <div className="absolute z-[10000] w-full mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  className={`cursor-pointer w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    option.value === value
                      ? "bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-500"
                      : ""
                  } ${index === 0 ? "rounded-t-xl" : ""} ${
                    index === filteredOptions.length - 1 ? "rounded-b-xl" : ""
                  }`}
                  onMouseDown={() => handleSelect(option)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.value === value && (
                      <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-gray-500 dark:text-gray-400">
                No results found
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchableDropdown;
