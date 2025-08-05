import React from "react";
import useDarkMode from "../../../hooks/useDarkMode";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeToggler = () => {
  const [theme, setTheme] = useDarkMode();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/50 dark:hover:to-purple-900/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          <SunIcon className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
        ) : (
          <MoonIcon className="w-5 h-5 transform group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
    </button>
  );
};

export default ThemeToggler;
