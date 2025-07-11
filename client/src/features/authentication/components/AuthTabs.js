import React from "react";

const AuthTabs = ({ isLogin, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => onTabChange(true)} // true for login
        className={`cursor-pointer w-1/2 py-4 text-center font-medium text-sm transition-colors ${
          isLogin
            ? "border-b-2 border-indigo-600 text-indigo-600"
            : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onTabChange(false)} // false for register
        className={`cursor-pointer w-1/2 py-4 text-center font-medium text-sm transition-colors ${
          !isLogin
            ? "border-b-2 border-indigo-600 text-indigo-600"
            : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
