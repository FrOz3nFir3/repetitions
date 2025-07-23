import React, { useState } from "react";
import { PlusIcon, FolderPlusIcon } from "@heroicons/react/24/solid";

const CreateCategoryCard = ({ onCreate }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onCreate(newCategory.trim());
      setNewCategory("");
    }
  };

  return (
    <div className="relative rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-indigo-200/50 dark:border-indigo-700/50 hover:shadow-2xl transition-all duration-300 group min-h-[280px]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
          <FolderPlusIcon className="h-10 w-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-2">
          Create Category
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          Add a new category to organize your cards
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name..."
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={!newCategory.trim()}
            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl group/btn"
          >
            <PlusIcon className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-200" />
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryCard;
