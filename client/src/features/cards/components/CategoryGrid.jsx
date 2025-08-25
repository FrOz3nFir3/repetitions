import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const CategoryGrid = ({ categories, onCategoryClick, activeCategory }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {categories.map((item, index) => {
        const { category, cardCount } = item ?? {};
        return (
          <div
            key={category}
            onClick={() => onCategoryClick(category)}
            className={`group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl h-[180px] ${
              activeCategory === category
                ? "bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-500 shadow-2xl"
                : "bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {activeCategory !== category && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10"></div>
            )}
            <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center text-center">
              <h3
                className={`text-xl font-bold mb-4 transition-colors duration-300 line-clamp-2 ${
                  activeCategory === category
                    ? "text-white drop-shadow-sm"
                    : "text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                }`}
              >
                {category}
              </h3>
              <div className="flex items-center gap-2 text-sm opacity-75 group-hover:opacity-100 transition-all duration-300">
                <span
                  className={
                    activeCategory === category
                      ? "text-white/90 drop-shadow-sm font-medium"
                      : "text-gray-600 dark:text-gray-400 font-medium"
                  }
                >
                  View
                  {/* todo: probably make this format properly later */}
                  <strong className="ml-1">{cardCount}</strong> Cards
                </span>

                <ArrowRightIcon
                  className={`h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 ${
                    activeCategory === category
                      ? "text-white/90"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                />
              </div>

              <div
                className={`mt-4 w-12 h-1 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-white/70"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-16"
                }`}
              ></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/5 group-hover:to-indigo-600/5 transition-all duration-300 rounded-2xl"></div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
