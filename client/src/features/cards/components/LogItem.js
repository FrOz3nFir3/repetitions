import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const ValueDisplay = ({ value }) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return (
      <span className="text-gray-600 dark:text-white italic ">Not set</span>
    );
  }
  if (typeof value === "object") {
    return (
      <pre className="overflow-auto !text-left bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs ">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }
  return (
    <span className="text-gray-700 dark:text-gray-300 ">{String(value)}</span>
  );
};

const LogItem = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { summary, user, timestamp, changes } = log;

  const hasChanges = changes && changes.length > 0;
  const date = new Date(timestamp);

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm transition-all duration-300">
      <div
        className={`flex items-center p-3 ${
          hasChanges ? "cursor-pointer" : ""
        }`}
        onClick={() => hasChanges && setIsOpen(!isOpen)}
      >
        <div className="flex-grow">
          <p className="line-clamp-2 break-all font-semibold text-gray-800 dark:text-gray-200">
            {summary}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            by {user ? `${user.name} <${user.email}>` : "System"}
          </p>

          <div className="flex gap-2 items-center mt-2 text-xs">
            <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
              {date.toLocaleDateString()}
            </span>
            <span className=" bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md">
              {date.toLocaleTimeString()}
            </span>
          </div>
        </div>
        {hasChanges ? (
          <ChevronDownIcon
            className={`h-5 w-5 text-indigo-500 mr-3 flex-shrink-0 mt-1 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        ) : (
          <div className="w-5 mr-3"></div> // Placeholder for alignment
        )}
      </div>

      {isOpen && hasChanges && (
        <div className="border-t border-gray-200 dark:border-gray-600 p-4">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
            Details of changes:
          </h4>
          <ul className="space-y-3">
            {changes.map((change, index) => (
              <li key={index} className="text-sm">
                <strong className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {change.field}:
                </strong>
                <div className="mt-1 space-y-1">
                  <div className="flex items-start">
                    <span className=" text-red-500 font-bold w-10 flex-shrink-0">
                      Old:
                    </span>
                    <div className="overflow-auto p-1.5 rounded bg-red-200 dark:bg-red-900 text-red-600 dark:text-red-400 w-[1%] flex-grow text-center">
                      <ValueDisplay value={change.oldValue} />
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-500 font-bold w-10 flex-shrink-0">
                      New:
                    </span>
                    <div className="overflow-auto p-1.5 mt-1 rounded bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-400 w-[1%] flex-grow text-center">
                      <ValueDisplay value={change.newValue} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogItem;
