import React from "react";

const ToolbarButton = ({
  editor,
  onClick,
  disabled,
  isActive,
  tooltip,
  children,
}) => (
  <div className="relative flex items-center">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${
        editor.isEditable ? "" : "pointer-events-none"
      } peer h-8 p-2 flex items-center justify-center rounded cursor-pointer ${
        isActive
          ? "bg-indigo-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 peer-hover:scale-100 origin-bottom z-20">
      {tooltip}
    </div>
  </div>
);

export default ToolbarButton;
