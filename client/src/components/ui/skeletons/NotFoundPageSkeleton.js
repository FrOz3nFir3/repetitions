import React from "react";

const NotFoundPageSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] animate-pulse">
      <div className="text-center">
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-48 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-64 mx-auto"></div>
      </div>
    </div>
  );
};

export default NotFoundPageSkeleton;
