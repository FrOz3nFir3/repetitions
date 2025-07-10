import React from "react";

const GoogleIcon = () => (
  <svg className="w-10 h-10 mr-2" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 6.627 5.373 12 12 12z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30.022 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const SocialAccounts = ({ user, onConnectGoogle }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Social Accounts
      </h2>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GoogleIcon />
            <span className="text-2xl text-gray-900 dark:text-white">
              Google
            </span>
          </div>
          {user.googleId ? (
            <button className="pointer-events-none px-4 py-2 bg-green-500 text-white rounded-md ">
              Connected
            </button>
          ) : (
            <button
              onClick={onConnectGoogle}
              className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;
