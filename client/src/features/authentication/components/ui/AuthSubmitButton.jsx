import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

const AuthSubmitButton = ({ isLoading, loadingText, buttonText, Icon }) => {
  return (
    <div className="pt-2">
      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          {isLoading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <Icon className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          )}
        </span>
        {isLoading ? loadingText : buttonText}
      </button>
    </div>
  );
};

export default AuthSubmitButton;
