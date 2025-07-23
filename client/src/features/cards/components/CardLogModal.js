import React, { useState, useEffect, useRef, useCallback } from "react";
import LogItem from "./LogItem";
import { useGetCardLogsQuery } from "../../../api/apiSlice";
import CardLogSkeleton from "../../../components/ui/skeletons/CardLogSkeleton";
import { ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const CardLogModal = ({ isOpen, onClose, cardId }) => {
  const [page, setPage] = useState(1);
  const { data, isFetching, isError } = useGetCardLogsQuery(
    { cardId, page },
    { skip: !isOpen }
  );

  const observer = useRef();
  const lastLogElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, data?.hasMore]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setPage(1);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const logs = data?.logs || [];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 w-full max-w-lg h-full shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-orange-200/50 dark:border-orange-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-orange-200/50 dark:border-orange-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg">
              <ClockIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 dark:from-orange-300 dark:to-amber-300 bg-clip-text text-transparent">
                Complete Activity Timeline
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All changes and updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors duration-200 group"
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {logs.length > 0 &&
            logs.map((log, index) => {
              if (logs.length === index + 1) {
                return (
                  <div
                    ref={lastLogElementRef}
                    key={log._id}
                    className="relative"
                  >
                    {index < logs.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-orange-300 to-amber-300 dark:from-orange-600 dark:to-amber-600"></div>
                    )}
                    <LogItem log={log} />
                  </div>
                );
              }
              return (
                <div key={log._id} className="relative">
                  {index < logs.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-orange-300 to-amber-300 dark:from-orange-600 dark:to-amber-600"></div>
                  )}
                  <LogItem log={log} />
                </div>
              );
            })}
          {isFetching && (
            <>
              <CardLogSkeleton />
              <CardLogSkeleton />
              <CardLogSkeleton />
            </>
          )}
          {isError && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">
                Failed to load logs
              </p>
            </div>
          )}
          {!isFetching && !isError && logs.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-full mb-4">
                <DocumentTextIcon className="h-8 w-8 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                No Activity Logs
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                This card hasn't been modified yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardLogModal;
