import React from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";

const SearchComponent = ({
  searchTerm,
  handleSearchChange,
  handleSearchReset,
}) => {
  return (
    <div className="relative w-full sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search in gallery..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full pl-10 pr-10 py-2 border border-transparent rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300"
      />
      {searchTerm && (
        <button
          onClick={handleSearchReset}
          className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 group"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
        </button>
      )}
    </div>
  );
};

export default SearchComponent;
