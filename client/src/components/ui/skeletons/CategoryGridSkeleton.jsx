import React from "react";

const CategoryGridSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-68 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default CategoryGridSkeleton;
