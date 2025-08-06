import React from "react";
import { Link } from "react-router-dom";
import { RocketLaunchIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const EmptyState = ({ title, message, ctaText, ctaLink }) => {
  return (
    <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <RocketLaunchIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        {message}
      </p>
      <Link
        to={ctaLink}
        className="inline-flex items-center px-8 py-4 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <BookOpenIcon className="w-5 h-5 mr-2" />
        {ctaText}
      </Link>
    </div>
  );
};

export default EmptyState;
