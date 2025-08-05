import React from "react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

const EmptyState = ({ message, details }) => {
  return (
    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed dark:border-gray-700 mt-4">
      <DocumentMagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {message}
      </h3>
      {details && (
        <p className="text-gray-500 dark:text-gray-400 mt-1">{details}</p>
      )}
    </div>
  );
};

export default EmptyState;
