import React, { forwardRef } from "react";

const commonInputClass =
  "block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 pl-12 py-4 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 sm:text-sm transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500";

const AuthInput = forwardRef(({ id, label, Icon, disabled, ...rest }, ref) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          id={id}
          ref={ref}
          className={commonInputClass}
          disabled={disabled}
          {...rest}
        />
      </div>
    </div>
  );
});

export default AuthInput;
