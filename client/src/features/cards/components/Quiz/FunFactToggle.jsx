import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";

const FunFactToggle = ({ showFacts, onToggle }) => {
  return (
    <div className="mt-8 mb-6 flex justify-center items-center">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center space-x-4">
          <SparklesIcon
            className={`h-6 w-6 transition-colors duration-300 ${
              showFacts ? "text-yellow-500" : "text-gray-400"
            }`}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Fun Facts
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Get interesting facts after each answer
            </span>
          </div>
          <button
            onClick={onToggle}
            className={`${
              showFacts
                ? "bg-gradient-to-r from-purple-500 to-pink-600"
                : "bg-gray-300 dark:bg-gray-600"
            } cursor-pointer relative inline-flex shrink-0 h-7 w-12 items-center rounded-full transition-all duration-300 shadow-lg hover:shadow-xl`}
          >
            <span
              className={`${
                showFacts ? "translate-x-6" : "translate-x-1"
              } inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunFactToggle;
