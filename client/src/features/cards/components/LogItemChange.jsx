import React, { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/solid";
import useDarkMode from "../../../hooks/useDarkMode";
import RevertChangeModal from "./RevertChangeModal";
import LazyDiffViewer from "./LazyDiffViewer";

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
        <LazyDiffViewer
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

export default LogItemChange;

