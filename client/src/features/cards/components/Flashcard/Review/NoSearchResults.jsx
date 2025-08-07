import React from "react";

const NoSearchResults = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-7.5 bg-gray-100/50 dark:bg-gray-900/50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        No Cards Found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Try adjusting your search.
      </p>
    </div>
  );
};

export default NoSearchResults;
