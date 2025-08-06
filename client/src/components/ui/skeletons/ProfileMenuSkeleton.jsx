import React from "react";

const ProfileMenuSkeleton = () => {
  return (
    <div className="hidden md:block animate-pulse">
      <div className="flex items-center space-x-2 p-2 rounded-xl bg-gray-200 dark:bg-gray-700">
        <div className="w-7 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileMenuSkeleton;
