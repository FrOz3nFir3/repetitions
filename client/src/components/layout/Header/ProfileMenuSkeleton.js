import React from "react";

const ProfileMenuSkeleton = () => {
  return (
    <div className="animate-pulse flex items-center ml-4">
      <div className="hidden md:block px-4 py-2 h-9 w-33 bg-gray-300 dark:bg-gray-700 rounded"></div>
    </div>
  );
};

export default ProfileMenuSkeleton;
