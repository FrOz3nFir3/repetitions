import React from "react";
import {
  UserCircleIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const InfoLine = ({ icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
    <div className="w-6 h-6 mr-3 text-gray-400 dark:text-gray-500">{icon}</div>
    <div>
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        {label}:
      </span>{" "}
      {value}
    </div>
  </div>
);

const CardMetaInfo = ({ card }) => {
  const { author, createdAt, lastUpdatedBy, updatedAt } = card;

  return (
    <div className="space-y-4">
      {author && (
        <div>
          <h4 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
            Author
          </h4>
          <div className="space-y-2">
            <InfoLine
              icon={<UserCircleIcon />}
              label="Name"
              value={`${author.name} <${author.email}>`}
            />
            <InfoLine
              icon={<CalendarIcon />}
              label="Created"
              value={new Date(createdAt).toLocaleDateString()}
            />
          </div>
        </div>
      )}

      {lastUpdatedBy && (
        <div>
          <h4 className="text-md font-semibold text-indigo-600 dark:text-indigo-400 mb-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            Last Update
          </h4>
          <div className="space-y-2">
            <InfoLine
              icon={<PencilIcon />}
              label="By"
              value={`${lastUpdatedBy.name} <${lastUpdatedBy.email}>`}
            />
            <InfoLine
              icon={<ClockIcon />}
              label="On"
              value={new Date(updatedAt).toLocaleString()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardMetaInfo;
