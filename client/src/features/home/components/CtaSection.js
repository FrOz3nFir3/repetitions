import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { Link } from "react-router-dom";
import React from "react";

const CtaSection = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">
            Start learning for free today.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            {user ? (
              <Link
                to="progress"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Go to Your Progress
              </Link>
            ) : (
              <Link
                to="/authenticate"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Sign up now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
