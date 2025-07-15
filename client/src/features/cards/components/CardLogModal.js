import React, { useState, useEffect, useRef, useCallback } from "react";
import LogItem from "./LogItem";
import { useGetCardLogsQuery } from "../../../api/apiSlice";
import CardLogSkeleton from "../../../components/ui/skeletons/CardLogSkeleton";

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
      className="fixed inset-0 bg-black/70 bg-opacity-60 flex justify-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg h-full shadow-xl transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            All Activity Logs
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
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
        <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-65px)]">
          {logs.length > 0 &&
            logs.map((log, index) => {
              if (logs.length === index + 1) {
                return (
                  <div ref={lastLogElementRef} key={log._id}>
                    <LogItem log={log} />
                  </div>
                );
              }
              return <LogItem key={log._id} log={log} />;
            })}
          {isFetching && (
            <>
              <CardLogSkeleton />
              <CardLogSkeleton />
              <CardLogSkeleton />
            </>
          )}
          {isError && (
            <p className="text-red-500 text-center py-10">
              Failed to load logs.
            </p>
          )}
          {!isFetching && !isError && logs.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
              No logs available for this card.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardLogModal;
