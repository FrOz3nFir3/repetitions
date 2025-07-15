import React, { useState } from "react";
import CardLogModal from "./CardLogModal";
import LogItem from "./LogItem";

const CardLogs = ({ logs, cardId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const sortedLogs = logs
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const recentLogs = sortedLogs.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Activity Logs
      </h3>
      {recentLogs.length > 0 ? (
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <LogItem key={log._id} log={log} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No activity has been logged for this card yet.
        </p>
      )}
      {logs.length > 5 && (
        <button
          onClick={toggleModal}
          className="cursor-pointer mt-5 w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          View All Logs
        </button>
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
