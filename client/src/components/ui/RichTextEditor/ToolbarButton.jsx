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
        editor?.isEditable ? "" : "pointer-events-none"
      } peer h-8 w-8 flex items-center justify-center rounded-md cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-indigo-500 text-white shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700`}
    >
      {children}
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-auto px-2 py-1 min-w-max rounded-md shadow-lg text-white bg-gray-900 text-xs font-medium transition-all duration-150 scale-0 opacity-0 peer-hover:scale-100 peer-hover:opacity-100 origin-bottom z-30 pointer-events-none">
      {tooltip}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export default ToolbarButton;
