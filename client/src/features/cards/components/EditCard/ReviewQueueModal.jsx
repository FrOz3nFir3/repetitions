import React from "react";
import Modal from "../../../../components/ui/Modal";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import {
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

const ReviewQueueModal = ({
  isOpen,
  onClose,
  queueItem,
  onAccept,
  onReject,
  isAccepting,
  isRejecting,
  error,
}) => {
  const {
    changeType,
    field,
    submittedBy,
    submittedAt,
    newValue,
    oldValue,
    newDisplayText,
    oldDisplayText,
    expiresAt,
  } = queueItem;

  const user = useSelector(selectCurrentUser);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case "edit":
        return <PencilIcon className="h-6 w-6 text-white" />;
      case "addition":
        return <PlusIcon className="h-6 w-6 text-white" />;
      case "deletion":
        return <TrashIcon className="h-6 w-6 text-white" />;
      default:
        return <PencilIcon className="h-6 w-6 text-white" />;
    }
  };

  const getChangeTypeColor = (type) => {
    switch (type) {
      case "edit":
        return "from-blue-500 to-blue-600";
      case "addition":
        return "from-green-500 to-green-600";
      case "deletion":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getChangeTypeText = (type) => {
    switch (type) {
      case "edit":
        return "Edit Change";
      case "addition":
        return "Addition";
      case "deletion":
        return "Deletion";
      default:
        return "Change";
    }
  };

  const isRichTextField = (fieldName) => {
    const richTextFields = [
      "Flashcard Question",
      "Flashcard Answer",
      "Quiz Question",
      "Quiz Answer",
      "Description",
      "New Flashcard",
      "New Quiz",
      "Quiz Option",
    ];
    return richTextFields.some((field) => fieldName.includes(field));
  };

  const renderValue = (value, displayText, fieldName) => {
    // Priority 1: Use displayText if available for specific fields
    if (displayText) {
      if (
        fieldName.endsWith(" Order") ||
        fieldName === "Quiz Flashcard Association"
      ) {
        return (
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {displayText}
          </pre>
        );
      }
    }

    // Priority 2: Handle rich text content
    if (
      typeof value === "string" &&
      value.includes("<") &&
      value.includes(">")
    ) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <RichTextEditor initialContent={value} editable={false} />
        </div>
      );
    }

    // Priority 3: Handle complex objects for additions/deletions
    if (typeof value === "object" && value !== null) {
      if (fieldName.includes("Flashcard")) {
        return renderDeletionValue(value, fieldName);
      }
      if (fieldName.includes("Quiz")) {
        return renderDeletionValue(value, fieldName);
      }
      // Fallback for other objects
      return (
        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    // Priority 4: Default rendering for strings and other primitives
    return (
      <div className="text-sm text-gray-800 dark:text-gray-200 break-word whitespace-pre-wrap">
        {String(value)}
      </div>
    );
  };

  const renderGroupedChanges = (individualChanges) => {
    if (!individualChanges || !Array.isArray(individualChanges)) return null;

    return (
      <div className="space-y-4">
        {/* Individual Changes */}
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Detailed Changes ({individualChanges.length}):
        </div>
        <div className="space-y-3">
          {individualChanges.map((change, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {change.field}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    change.changeType === "edit"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : change.changeType === "addition"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {change.changeType}
                </span>
              </div>

              {change.changeType === "edit" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                      Before:
                    </p>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-3">
                      {renderValue(
                        change.oldValue,
                        change.oldDisplayText,
                        change.field
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                      After:
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3">
                      {renderValue(
                        change.newValue,
                        change.newDisplayText,
                        change.field
                      )}
                    </div>
                  </div>
                </div>
              )}

              {change.changeType === "addition" && (
                <div>
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                    Adding:
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-3">
                    {change.field.includes("New Flashcard") ||
                    change.field.includes("New Quiz")
                      ? renderAdditionValue(change.newValue, change.field)
                      : renderValue(
                          change.newValue,
                          change.newDisplayText,
                          change.field
                        )}
                  </div>
                </div>
              )}

              {change.changeType === "deletion" && (
                <div>
                  <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                    Removing:
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-3">
                    {change.field.includes("Flashcard") ||
                    change.field.includes("Quiz")
                      ? renderDeletionValue(change.oldValue, change.field)
                      : renderValue(
                          change.oldValue,
                          change.oldDisplayText,
                          change.field
                        )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDeletionValue = (value, fieldName) => {
    // Handle flashcard deletions
    if (
      fieldName.includes("Flashcard") &&
      typeof value === "object" &&
      value !== null
    ) {
      return (
        <div className="space-y-4">
          {value.question && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Question:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.question}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.answer && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Answer:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.answer}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle quiz deletions
    if (
      fieldName.includes("Quiz") &&
      typeof value === "object" &&
      value !== null
    ) {
      return (
        <div className="space-y-4">
          {value.quizQuestion && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Question:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.quizQuestion}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.quizAnswer && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Answer:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.quizAnswer}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.options && value.options.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Options:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {value.options.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                        Option {index + 2}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <RichTextEditor
                        initialContent={option}
                        editable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {value.minimumOptions && (
            <div>
              <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                Minimum Options:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-red-200/50 dark:border-red-600/50">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {value.minimumOptions}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Fallback to regular rendering for other types
    return renderValue(value, null, fieldName);
  };

  const renderAdditionValue = (value, fieldName) => {
    // Handle new flashcard additions
    if (
      fieldName.includes("Flashcard") &&
      typeof value === "object" &&
      value !== null
    ) {
      return (
        <div className="space-y-4">
          {value.question && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Question:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.question}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.answer && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Answer:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.answer}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Handle new quiz additions
    if (
      fieldName.includes("Quiz") &&
      typeof value === "object" &&
      value !== null
    ) {
      return (
        <div className="space-y-4">
          {value.quizQuestion && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Question:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.quizQuestion}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.quizAnswer && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Answer:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <RichTextEditor
                    initialContent={value.quizAnswer}
                    editable={false}
                  />
                </div>
              </div>
            </div>
          )}
          {value.options && value.options.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Options:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {value.options.map((option, index) => (
                  <div
                    key={index}
                    className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        Option {index + 2}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <RichTextEditor
                        initialContent={option}
                        editable={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {value.minimumOptions && (
            <div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                Minimum Options:
              </p>
              <div className="bg-white/60 dark:bg-gray-900/30 rounded-lg p-3 border border-green-200/50 dark:border-green-600/50">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {value.minimumOptions}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Fallback to regular rendering for other types
    return renderValue(value, null, fieldName);
  };

  return (
    <Modal
      maxWidth="7xl"
      isOpen={isOpen}
      onClose={onClose}
      title="Review Change"
      className={`!bg-gradient-to-br !from-indigo-50 !to-blue-50 dark:!from-gray-900 dark:!to-gray-800 rounded-2xl !z-[70]`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 bg-gradient-to-r ${getChangeTypeColor(
                changeType
              )} rounded-xl shadow-lg`}
            >
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-700 dark:from-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
                {getChangeTypeText(changeType)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Review and approve or reject this collaborative change
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-xl p-4 flex items-center gap-3">
          <div
            className={`p-2 bg-gradient-to-r ${getChangeTypeColor(
              changeType
            )} rounded-lg`}
          >
            {getChangeTypeIcon(changeType)}
          </div>
          <div>
            <p className="text-indigo-800 dark:text-indigo-200 font-medium text-sm">
              Collaborative {changeType} to {field}
            </p>
            <p className="text-indigo-700 dark:text-indigo-300 text-xs mt-1">
              This change will{" "}
              {changeType === "deletion"
                ? "remove content"
                : changeType === "addition"
                ? "add new content"
                : "modify existing content"}
            </p>
          </div>
        </div>
      </div>

      {/* Change Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-200/50 dark:border-indigo-700/50 mb-6">
        <div className="p-6">
          {/* Field and User Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-indigo-200/50 dark:border-indigo-700/50">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {field}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Field modification details
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              {submittedBy && submittedBy.name && (
                <div className="flex items-center gap-2 text-sm">
                  <UserCircleIcon className="h-4 w-4 text-indigo-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {submittedBy.name} (@{submittedBy.username})
                  </span>
                </div>
              )}
              {submittedBy && !submittedBy.name && (
                <div className="flex items-center gap-2 text-sm">
                  <UserCircleIcon className="h-4 w-4 text-indigo-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium italic">
                    User information loading...
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4" />
                <span>Submitted: {formatDate(submittedAt)}</span>
              </div>
              {expiresAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4" />
                  <span>Expires: {formatDate(expiresAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Comparison */}
          <div className="space-y-4">
            {/* Check if this is a grouped change */}
            {queueItem.metadata && queueItem.metadata.individualChanges ? (
              renderGroupedChanges(queueItem.metadata.individualChanges)
            ) : (
              <>
                {changeType === "edit" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <p className="font-semibold text-red-700 dark:text-red-300">
                          Current
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
                        {renderValue(oldValue, oldDisplayText, field)}
                      </div>
                    </div>

                    {/* Proposed Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          Proposed
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                        {renderValue(newValue, newDisplayText, field)}
                      </div>
                    </div>
                  </div>
                )}

                {changeType === "addition" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <p className="font-semibold text-green-700 dark:text-green-300">
                        Content to Add
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                      {renderAdditionValue(newValue, field)}
                    </div>
                  </div>
                )}

                {changeType === "deletion" && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <p className="font-semibold text-red-700 dark:text-red-300">
                        Content to Remove
                      </p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4">
                      {field.includes("Flashcard") || field.includes("Quiz")
                        ? renderDeletionValue(oldValue, field)
                        : renderValue(oldValue, oldDisplayText, field)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 mt-4 flex flex-wrap gap-4 items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-400">
          Choose to accept or reject this collaborative change
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isAccepting || isRejecting}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium"
          >
            <XMarkIcon className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={onReject}
            disabled={isAccepting || isRejecting || !user}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            {isRejecting ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <XMarkIcon className="h-5 w-5" />
            )}
            {isRejecting ? "Rejecting..." : "Reject Change"}
          </button>
          <button
            onClick={onAccept}
            disabled={isAccepting || isRejecting || !user}
            className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            {isAccepting ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <CheckIcon className="h-5 w-5" />
            )}
            {isAccepting ? "Accepting..." : "Accept Change"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewQueueModal;
