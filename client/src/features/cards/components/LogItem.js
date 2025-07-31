import React, { useState } from "react";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/24/solid";
import ReactDiffViewer from "react-diff-viewer-continued";
import useDarkMode from "../../../hooks/useDarkMode";
import RevertChangeModal from "./RevertChangeModal";

const LogItemChange = ({ change }) => {
  const [theme] = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <li className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-orange-200/50 dark:border-orange-700/50">
      <div className="flex flex-wrap justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <strong className="font-semibold text-orange-800 dark:text-orange-200 capitalize text-sm">
            {change.field}
          </strong>
        </div>
        {change.oldValue && change.newValue && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-all duration-200 text-xs font-medium group"
            title="View and Revert Change"
          >
            <EyeIcon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
            <span>View & Revert</span>
          </button>
        )}
      </div>
      <div className="rounded-lg overflow-hidden border border-orange-200/30 dark:border-orange-700/30">
        <ReactDiffViewer
          className="max-w-full"
          oldValue={change.oldValue}
          newValue={change.newValue}
          splitView={false}
          hideLineNumbers
          useDarkTheme={theme === "dark"}
          styles={{
            diffContainer: {
              minWidth: "100%",
            },
          }}
        />
      </div>
      {isModalOpen && (
        <RevertChangeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          change={change}
        />
      )}
    </li>
  );
};

const LogItem = ({ log }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { summary, user, timestamp, changes } = log;

  const hasChanges = changes && changes.length > 0;
  const date = new Date(timestamp);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-orange-200/30 dark:border-orange-700/30 hover:shadow-xl transition-all duration-300 group">
      <div
        className={`flex items-start gap-4 p-4 ${
          hasChanges ? "cursor-pointer" : ""
        }`}
        onClick={() => hasChanges && setIsOpen(!isOpen)}
      >
        {/* Timeline dot */}
        <div className="animate-pulse flex-shrink-0 w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2 shadow-lg"></div>

        <div className="flex-grow min-w-0">
          <p className="font-medium text-gray-800 dark:text-gray-200 mb-3 break-word line-clamp-3">
            {summary}
          </p>

          {/* User Information */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <svg
              className="h-4 w-4 text-blue-500 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300  break-all line-clamp-2 ">
              {user ? user.name : "System"}
            </span>
            {user && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md break-all line-clamp-2">
                {user.email}
              </span>
            )}
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5 text-green-500 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {date.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {hasChanges && (
          <ChevronDownIcon
            className={`h-5 w-5 text-orange-500 flex-shrink-0 mt-1 transition-transform duration-200 group-hover:text-orange-600 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isOpen && hasChanges && (
        <div className="border-t border-orange-200/50 dark:border-orange-700/50 p-4 bg-orange-50/50 dark:bg-orange-900/10">
          <h4 className="font-semibold text-sm text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-2">
            <svg
              className="h-4 w-4 text-orange-600 dark:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Change Details
          </h4>

          <ul className="space-y-3">
            {changes.map((change, index) => (
              <LogItemChange key={index} change={change} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogItem;
