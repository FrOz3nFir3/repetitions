import React from "react";

const MobileMenuSkeleton = () => {
  return (
    <div className="block md:hidden animate-pulse">
      <div className="flex items-center h-10 space-x-2 p-2 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
};

export default MobileMenuSkeleton;
