import React from "react";

const SocialAuthDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300">
          Or continue with
        </span>
      </div>
    </div>
  );
};

export default SocialAuthDivider;
