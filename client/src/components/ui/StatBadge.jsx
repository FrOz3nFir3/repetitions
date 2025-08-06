import React from "react";

const StatBadge = ({ label, value, color, icon: Icon }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-600">
    <div className="flex items-center justify-center mb-1">
      <Icon className={`w-4 h-4 ${color} mr-1`} />
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </p>
    </div>
    <p className={`text-lg font-bold ${color}`}>{value}</p>
  </div>
);

export default StatBadge;
