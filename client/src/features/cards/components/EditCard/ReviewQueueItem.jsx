import React from "react";
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  UserCircleIcon,
  ClockIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { getTextFromHtml } from "../../../../utils/dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

const ReviewQueueItem = React.forwardRef(
  (
    { queueItem, onAccept, onReject, onViewDetails, isAccepting, isRejecting },
    ref
  ) => {
    const {
      _id,
      changeType,
      field,
      submittedBy,
      submittedAt,
      newValue,
      oldValue,
      newDisplayText,
      oldDisplayText,
    } = queueItem;
    const user = useSelector(selectCurrentUser);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      }
    };

    const getChangeTypeIcon = (type) => {
      switch (type) {
        case "edit":
          return <PencilIcon className="h-4 w-4" />;
        case "addition":
          return <PlusIcon className="h-4 w-4" />;
        case "deletion":
          return <TrashIcon className="h-4 w-4" />;
        default:
          return <PencilIcon className="h-4 w-4" />;
      }
    };

    const getChangeTypeColor = (type) => {
      switch (type) {
        case "edit":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
        case "addition":
          return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
        case "deletion":
          return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
        default:
          return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      }
    };

    const getPreviewText = (value, displayText) => {
      if (displayText) return displayText;

      // Handle object values (flashcards and quizzes)
      if (typeof value === "object" && value !== null) {
        if (value.question) {
          const stripped = getTextFromHtml(value.question);
          return stripped.length > 250
            ? stripped.substring(0, 250) + "..."
            : stripped;
        }
        if (value.quizQuestion) {
          const stripped = getTextFromHtml(value.quizQuestion);
          return stripped.length > 250
            ? stripped.substring(0, 250) + "..."
            : stripped;
        }
        // For new additions, show a summary instead of JSON
        if (field.includes("New Flashcard")) {
          return "New flashcard with question and answer";
        }
        if (field.includes("New Quiz")) {
          const optionCount = value.options ? value.options.length : 0;
          return `New quiz with question, answer${
            optionCount > 0 ? `, and ${optionCount} options` : ""
          }`;
        }
        // For deletions, show what's being deleted
        if (field.includes("Flashcard") && changeType === "deletion") {
          return "Deleting flashcard with question and answer";
        }
        if (field.includes("Quiz") && changeType === "deletion") {
          const optionCount = value.options ? value.options.length : 0;
          return `Deleting quiz with question, answer${
            optionCount > 0 ? `, and ${optionCount} options` : ""
          }`;
        }
        return changeType === "deletion" ? "Deleting content" : "New content";
      }

      if (typeof value === "string") {
        // Strip HTML tags for preview and limit to 3 lines (approximately 150 characters)
        const stripped = getTextFromHtml(value);
        return stripped.length > 250
          ? stripped.substring(0, 250) + "..."
          : stripped;
      }
      return JSON.stringify(value);
    };

    return (
      <div
        ref={ref}
        className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-2xl shadow-md hover:shadow-xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Gradient accent border */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
            changeType === "edit"
              ? "from-blue-500 to-indigo-500"
              : changeType === "addition"
              ? "from-green-500 to-emerald-500"
              : "from-red-500 to-rose-500"
          }`}
        />

        <div className="p-5 sm:p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Change Type Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm ${getChangeTypeColor(
                  changeType
                )}`}
              >
                {getChangeTypeIcon(changeType)}
                <span className="capitalize">{changeType}</span>
              </div>

              {/* Field Title */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                  {field}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {(submittedBy?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {submittedBy?.name || "Unknown User"}
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    <span className="text-xs">{formatDate(submittedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Preview */}
          <div className="mb-5">
            <div className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {changeType === "addition" && (
                  <span className="flex items-center gap-2">
                    <PlusIcon className="h-4 w-4 text-green-500" />
                    Adding new content
                  </span>
                )}
                {changeType === "deletion" && (
                  <span className="flex items-center gap-2">
                    <TrashIcon className="h-4 w-4 text-red-500" />
                    Removing content
                  </span>
                )}
                {changeType === "edit" && (
                  <span className="flex items-center gap-2">
                    <PencilIcon className="h-4 w-4 text-blue-500" />
                    Modifying content
                  </span>
                )}
              </div>

              {/* Content Preview */}
              {changeType === "addition" && newValue && (
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200/30 dark:border-gray-600/30">
                  {getPreviewText(newValue, newDisplayText)}
                </div>
              )}
              {(changeType === "deletion" || changeType === "edit") &&
                oldValue && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200/30 dark:border-gray-600/30">
                    {getPreviewText(oldValue, oldDisplayText)}
                  </div>
                )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* View Details Button */}
            <button
              onClick={onViewDetails}
              className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 border border-gray-200 dark:border-gray-600 rounded-xl transition-all duration-200 hover:shadow-md backdrop-blur-sm"
            >
              <EyeIcon className="h-4 w-4" />
              <span>View Details</span>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:flex-1">
              <button
                onClick={onReject}
                disabled={isRejecting || isAccepting || !user}
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-1 sm:flex-none sm:min-w-[100px]"
              >
                {isRejecting ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <XMarkIcon className="h-4 w-4" />
                )}
                <span>{isRejecting ? "Rejecting..." : "Reject"}</span>
              </button>

              <button
                onClick={onAccept}
                disabled={isAccepting || isRejecting || !user}
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex-1 sm:flex-none sm:min-w-[100px]"
              >
                {isAccepting ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                <span>{isAccepting ? "Accepting..." : "Accept"}</span>
              </button>
            </div>
          </div>

          {/* Mobile timestamp */}
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3 w-3" />
              <span>{formatDate(submittedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ReviewQueueItem.displayName = "ReviewQueueItem";

export default ReviewQueueItem;
