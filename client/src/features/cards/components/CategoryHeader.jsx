import React from "react";

const CategoryHeader = () => {
  return (
    <div className="text-center my-16">
      <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent pb-4">
        Pick a Category
      </h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Select a category to continue your learning journey or create a new one
        to organize your knowledge
      </p>
    </div>
  );
};

export default CategoryHeader;
