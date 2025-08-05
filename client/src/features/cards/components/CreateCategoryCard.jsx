import React, { useState } from "react";
import { PlusIcon, FolderPlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { normalizeCategory } from "../../../utils/textNormalization";

const CreateCategoryCard = ({ onCreate, onCancel }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onCreate(normalizeCategory(newCategory));
      setNewCategory("");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Close button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="cursor-pointer absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 z-20"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}

      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg mb-6 hover:scale-105 transition-transform duration-300">
          <FolderPlusIcon className="h-10 w-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent mb-3">
          Create New Category
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Add a new category to organize your study materials and keep your
          learning structured
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name..."
              autoFocus
              className="w-full px-6 py-4 bg-white dark:bg-gray-800 border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-lg font-medium"
            />
          </div>

          <div className="flex flex-col gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className={`cursor-pointer ${
                onCancel ? "flex-1" : "w-full"
              } flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl group`}
            >
              <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryCard;
