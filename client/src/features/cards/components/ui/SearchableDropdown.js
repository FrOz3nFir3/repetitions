import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getTextFromHtml } from "../../../../utils/dom";

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Update search term when the selection changes externally
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(getTextFromHtml(selectedOption.label));
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
          setSearchTerm(getTextFromHtml(selectedOption.label));
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
    setSearchTerm(getTextFromHtml(option.label));
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
        if (searchTerm !== getTextFromHtml(selectedOption?.label || "")) {
          return getTextFromHtml(option.label)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
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
          className="w-full p-2 pr-10 border rounded-lg bg-white dark:text-white dark:bg-gray-700 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          {value ? (
            <button
              onClick={handleClear}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Clear selection"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          ) : (
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200"
                onMouseDown={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
