import React from "react";
import { ClockIcon } from "@heroicons/react/24/solid";

const StudiedDecksHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg mb-6">
        <ClockIcon className="h-8 w-8 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent pb-4">
        Continue Learning
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Pick up where you left off and keep building your knowledge
      </p>
    </div>
  );
};

export default StudiedDecksHeader;
