import React, { useState } from "react";
import CardLogModal from "./CardLogModal";
import LogItem from "./LogItem";
import { ClockIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";

const CardLogs = ({ logs, cardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const sortedLogs = logs
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentLogs = sortedLogs.slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-200/50 dark:border-orange-700/50">
        <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl shadow-lg">
          <ClockIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
            Activity Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Recent changes and updates
          </p>
        </div>
      </div>

      {/* Logs Content */}
      {recentLogs.length > 0 ? (
        <div className="space-y-4">
          {recentLogs.map((log, index) => (
            <div key={log._id} className="relative">
              {/* Timeline line */}
              {index < recentLogs.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-orange-300 to-amber-300 dark:from-orange-600 dark:to-amber-600"></div>
              )}
              <LogItem log={log} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
            <DocumentTextIcon className="h-8 w-8 text-orange-500 dark:text-orange-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
            No Activity Yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Changes to this card will appear here
          </p>
        </div>
      )}

      {/* View All Button */}
      {logs.length >= 3 && (
        <div className="mt-6 pt-4 border-t border-orange-200/50 dark:border-orange-700/50">
          <button
            onClick={toggleModal}
            className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300 font-medium rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 group"
          >
            <EyeIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            View All Logs
          </button>
        </div>
      )}

      <CardLogModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        cardId={cardId}
      />
    </div>
  );
};

export default CardLogs;
