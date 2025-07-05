import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <p className="text-5xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Page Not Found</h1>
        <p className="mt-4 text-base text-gray-500">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-transform transform hover:scale-105"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
