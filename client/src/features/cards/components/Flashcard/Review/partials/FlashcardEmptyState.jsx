import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const FlashcardEmptyState = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-800 dark:via-slate-800 dark:to-indigo-900 shadow-2xl border-2 border-gray-200 dark:border-gray-700">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="relative z-10 text-center py-16 px-8">
        <div className="p-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-lg inline-block mb-6">
          <MagnifyingGlassIcon className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No matching cards found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Clear the search to see all cards
        </p>
      </div>
    </div>
  );
};

export default FlashcardEmptyState;
