import React from "react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const RestrictedAccess = ({ description }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center text-center py-12 px-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg">
        <LockClosedIcon className="h-12 w-12 mx-auto text-indigo-500" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-300">
          Access Restricted
        </h2>
        <p className="mt-2 text-gray-600 dark:text-white">
          {description ||
            "You need to be logged in to access this page. Please log in or sign up to continue."}
        </p>
        <div className="mt-8">
          <Link
            to="/authenticate"
            className="w-full inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Login or Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;
