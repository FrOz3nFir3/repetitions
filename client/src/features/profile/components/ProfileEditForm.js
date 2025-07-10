import React from "react";

const ProfileEditForm = ({
  user,
  nameRef,
  emailRef,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          ref={nameRef}
          defaultValue={user.name}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          ref={emailRef}
          defaultValue={user.email}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-start space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
