import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const UserInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Signed in as
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
