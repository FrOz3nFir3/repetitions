import React from "react";
import { RectangleStackIcon } from "@heroicons/react/24/outline";

const NoCardsPlaceholder = ({ username }) => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/30 dark:border-gray-700/30 p-8 text-center">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <RectangleStackIcon />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        No cards yet
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        @{username} hasn't created any cards yet.
      </p>
    </div>
  );
};

export default NoCardsPlaceholder;
