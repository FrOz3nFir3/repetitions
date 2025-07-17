import React, { useState } from "react";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/24/solid";
import ReactDiffViewer from "react-diff-viewer-continued";
import useDarkMode from "../../../hooks/useDarkMode";
import RevertChangeModal from "./RevertChangeModal";

const LogItemChange = ({ change }) => {
  const [theme] = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <li className="text-sm">
      <div className="flex flex-wrap justify-between items-center mb-1">
        <strong className="font-medium text-gray-800 dark:text-gray-200 capitalize">
          {change.field}:
        </strong>
        {change.oldValue && change.newValue && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 cursor-pointer flex items-center gap-1 px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-xs"
            title="View and Revert Change"
          >
            <EyeIcon className="h-4 w-4" />
            <span>View & Revert</span>
          </button>
        )}
      </div>
      <ReactDiffViewer
        className="max-w-full "
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
              <LogItemChange key={index} change={change} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogItem;
