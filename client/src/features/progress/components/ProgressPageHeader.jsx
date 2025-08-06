import React from "react";
import { ChartBarIcon, StarIcon } from "@heroicons/react/24/solid";

const ProgressPageHeader = ({ user }) => {
  return (
    <div className="text-center mb-16">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <StarIcon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        <span className="bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
          Your Learning Dashboard
        </span>
      </h1>
      <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
        Welcome back,{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          {user.name || user.email}
        </span>
        ! Track your progress and celebrate achievements.
      </p>
    </div>
  );
};

export default ProgressPageHeader;
