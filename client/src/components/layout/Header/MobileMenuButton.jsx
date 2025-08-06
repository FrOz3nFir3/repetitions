import React from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const MobileMenuButton = ({ isOpen, onClick }) => {
  return (
    <div className="md:hidden">
      <button
        onClick={onClick}
        className="cursor-pointer inline-flex items-center justify-center p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default MobileMenuButton;
