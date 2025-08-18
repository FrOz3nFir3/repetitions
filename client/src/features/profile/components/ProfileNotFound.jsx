import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const ProfileNotFound = ({ username }) => {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div>
        <div className="mx-auto h-24 w-24 text-indigo-400">
            <UserCircleIcon />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          User not found
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Sorry, we couldn’t find a user with the username "@{username}".
        </p>
        <div className="mt-6 flex justify-center items-center space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;
