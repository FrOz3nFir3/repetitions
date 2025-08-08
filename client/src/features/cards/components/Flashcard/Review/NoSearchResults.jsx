import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const NoSearchResults = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-[180px] px-8">
      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full mb-4">
        <MagnifyingGlassIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        No cards match your search
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
        Try different keywords or clear your search to see all cards
      </p>
    </div>
  );
};

export default NoSearchResults;
