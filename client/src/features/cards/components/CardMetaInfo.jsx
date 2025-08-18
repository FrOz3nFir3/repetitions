import React from "react";
import {
  UserCircleIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="flex-shrink-0 w-6 h-6 text-gray-500 dark:text-gray-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <div className="text-sm text-gray-900 dark:text-white font-medium break-words">
        {value}
      </div>
    </div>
  </div>
);

const CardMetaInfo = ({ card }) => {
  const { author, createdAt, lastUpdatedBy, updatedAt } = card;

  const formatUser = (user) => {
    if (!user) return "";
    return (
      <Link to={`/profile/${user.username}`} className="text-blue-600 dark:text-blue-400 hover:underline">
        @{user.username}
      </Link>
    );
  };

  return (
    <div className="space-y-4">
      {author && (
        <div className="space-y-2">
          <InfoItem
            icon={<UserCircleIcon />}
            label="Created by"
            value={formatUser(author)}
          />
          <InfoItem
            icon={<CalendarIcon />}
            label="Created on"
            value={new Date(createdAt).toLocaleDateString()}
          />
        </div>
      )}

      {lastUpdatedBy?.name && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
          <InfoItem
            icon={<PencilIcon />}
            label="Updated by"
            value={formatUser(lastUpdatedBy)}
          />
          <InfoItem
            icon={<ClockIcon />}
            label="Updated on"
            value={new Date(updatedAt).toLocaleString()}
          />
        </div>
      )}
    </div>
  );
};

export default CardMetaInfo;