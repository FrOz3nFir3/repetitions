import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

const LogItemChange = ({ change }) => {
  // Determine icon based on field type
  const getIcon = () => {
    if (change.field.includes("Deleted")) {
      return <TrashIcon className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
    if (change.field.includes("New")) {
      return (
        <PlusCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    }
    if (change.field.includes("Order")) {
      return (
        <ArrowsUpDownIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      );
    }
    return (
      <PencilSquareIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
    );
  };

  // Determine background color based on field type
  const getBgColor = () => {
    if (change.field.includes("Deleted")) {
      return "from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20";
    }
    if (change.field.includes("New")) {
      return "from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/20";
    }
    if (change.field.includes("Order")) {
      return "from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/20";
    }
    return "from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30";
  };

  return (
    <li className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getBgColor()} flex items-center justify-center shadow-sm`}
          >
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <strong className="font-semibold text-gray-800 dark:text-gray-200 text-sm block">
            {change.field}
          </strong>
          {change.preview && (
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed break-words mt-1">
              {change.preview}
            </p>
          )}
        </div>
      </div>
    </li>
  );
};

export default LogItemChange;
