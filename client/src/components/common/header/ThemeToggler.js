import React from "react";
import useDarkMode from "../../../hooks/useDarkMode";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const ThemeToggler = () => {
  const [theme, setTheme] = useDarkMode();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`cursor-pointer p-2 rounded-full text-black  ${
        theme === "dark"
          ? "hover:bg-white hover:text-black text-white"
          : "hover:bg-gray-700 hover:text-white text-black"
      } focus:outline-none `}
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeToggler;
