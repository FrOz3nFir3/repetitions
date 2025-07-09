import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/authentication/authSlice";
import PreviouslyStudiedSkeleton from "../../features/category/PreviouslyStudiedSkeleton";

const CategorySkeleton = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto !px-4 !py-8">
        {user && <PreviouslyStudiedSkeleton />}
        <div className="my-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <CategorySkeletonItem key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategorySkeletonItem = () => {
  return (
    <div className="relative rounded-xl self-start shadow-lg p-6 flex flex-col justify-between items-center text-center bg-white dark:bg-gray-800">
      <div className="animate-pulse w-full">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );
};

export default CategorySkeleton;
