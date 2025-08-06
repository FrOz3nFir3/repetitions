import React from "react";
import {
  CheckCircleIcon,
  XMarkIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const FeatureCard = ({
  title,
  subtitle,
  icon: Icon,
  features,
  isHighlight = false,
}) => {
  const cardClasses = isHighlight
    ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/50 dark:to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-indigo-200 dark:border-indigo-700 relative overflow-hidden h-fit"
    : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-fit";

  const iconContainerClasses = isHighlight
    ? "w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4"
    : "w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4";

  const iconClasses = isHighlight
    ? "w-6 h-6 text-white"
    : "w-6 h-6 text-gray-600 dark:text-gray-300";

  return (
    <div className={cardClasses}>
      {isHighlight && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          UNLOCK ALL
        </div>
      )}
      <div className="flex items-center mb-6">
        <div className={iconContainerClasses}>
          <Icon className={iconClasses} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p
            className={`text-sm ${
              isHighlight
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {feature.available ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <XMarkIcon className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className={feature.available ? "" : "opacity-60"}>
              <div className="flex items-center mb-1">
                <feature.icon
                  className={`w-4 h-4 mr-2 ${
                    isHighlight
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                />
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                {!feature.available && (
                  <LockClosedIcon className="w-3 h-3 ml-2 text-red-400" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCard;
