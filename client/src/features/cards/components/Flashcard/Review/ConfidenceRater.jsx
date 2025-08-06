import React from "react";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";

const ConfidenceRater = ({ onRate }) => {
  return (
    <div className="flex justify-center mb-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-gray-200/60 dark:border-gray-700/60 w-full max-w-4xl ">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex flex-wrap justify-center items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <LightBulbIcon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Rate Your Understanding
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            How confident are you with this flashcard?
          </p>
        </div>

        {/* Rating Buttons */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => onRate("mastered")}
            className="shrink-0 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white p-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold">Perfect!</div>
                <div className="text-xs opacity-90">I knew this well</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => onRate("partial")}
            className="shrink-0 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-700 text-white p-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold">Close</div>
                <div className="text-xs opacity-90">Almost got it</div>
              </div>
            </div>
            <div className="absolute top-2 right-2 ">
              <div className="bg-white/30 text-xs px-2 py-1 rounded-full text-white font-medium shadow-sm">
                Review
              </div>
            </div>
          </button>
          <button
            onClick={() => onRate("struggling")}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 hover:from-red-600 hover:via-rose-600 hover:to-pink-700 text-white p-4 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex-1"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <QuestionMarkCircleIcon className="w-6 h-6" />
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold">Difficult</div>
                <div className="text-xs opacity-90">Need more practice</div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-white/30 text-xs px-2 py-1 rounded-full text-white font-medium shadow-sm">
                Review
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceRater;
