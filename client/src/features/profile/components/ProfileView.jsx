import React from "react";

const ProfileView = ({ user, onEdit }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Name
        </h2>
        <p className="text-gray-900 dark:text-white">{user.name}</p>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Email
        </h2>
        <p className="text-gray-900 dark:text-white">{user.email}</p>
      </div>
      <button
        onClick={onEdit}
        className="cursor-pointer mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileView;
