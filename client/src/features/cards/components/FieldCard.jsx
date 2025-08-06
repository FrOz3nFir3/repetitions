import React from "react";

const FieldCard = ({ icon: Icon, title, children, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-600 border-blue-200 dark:border-blue-700",
    green:
      "from-green-500 to-emerald-600 border-green-200 dark:border-green-700",
    orange:
      "from-orange-500 to-amber-600 border-orange-200 dark:border-orange-700",
    purple:
      "from-purple-500 to-violet-600 border-purple-200 dark:border-purple-700",
    gray: "from-gray-500 to-slate-600 border-gray-200 dark:border-gray-700",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 ${colorClasses[color]} hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="ml-1">{children}</div>
      </div>
    </div>
  );
};

export default FieldCard;
