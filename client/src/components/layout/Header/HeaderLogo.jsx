import React from "react";
import { Link } from "react-router-dom";
import RepetitionsLogo from "../../svg/RepetitionsLogo";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center group">
      <div className="relative">
        <RepetitionsLogo />
      </div>
      <span className="ml-3 text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
        Repetitions
      </span>
    </Link>
  );
};

export default HeaderLogo;
