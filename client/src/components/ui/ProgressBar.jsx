import React from "react";

const ProgressBar = ({ label, value, color }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        {value}%
      </span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
      <div
        className={`${color} h-3 rounded-full transition-all duration-500 ease-out shadow-sm`}
        style={{ width: `${value}%` }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default ProgressBar;
