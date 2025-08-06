import React from "react";
import { NavLink } from "react-router-dom";

const DesktopNav = ({ navigation }) => {
  return (
    <div className="hidden md:block ml-10">
      <div className="flex items-center space-x-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                  : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DesktopNav;
