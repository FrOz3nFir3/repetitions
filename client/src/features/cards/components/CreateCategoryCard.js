import React, { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

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
    <div className="relative rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center bg-white dark:bg-gray-800">
      <PlusCircleIcon className="h-12 w-12 text-indigo-500 mb-4" />
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Create New
      </h3>
      <form onSubmit={handleSubmit} className="w-full">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="cursor-pointer mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateCategoryCard;
