import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

const StatCard = ({ name, stat, icon: Icon, gradient, description, trend }) => (
  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
    <div className="p-6 h-full flex flex-col">
      {/* Header with icon and title */}
      <div className="flex items-center mb-4">
        <div
          className={`flex-shrink-0 ${gradient} rounded-xl p-3 shadow-lg mr-4`}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {name}
          </dt>
          <dd className="text-3xl font-bold text-gray-900 dark:text-white">
            {stat}
          </dd>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-1">
          {description}
        </p>
      )}

      {/* Trend badge at bottom */}
      {trend && (
        <div className="mt-auto">
          <div className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <SparklesIcon className="w-3 h-3 mr-1.5" />
            <span>{trend}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
