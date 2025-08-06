import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

const AuthErrorDisplay = ({ error }) => {
  if (!error?.data?.error) return null;

  return (
    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {error.data.error}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorDisplay;
