import { useState, useEffect, useRef, useCallback } from "react";
import { useGetCardLogsQuery } from "../api/apiSlice";
import { useDebounce } from "./useDebounce";
import { usePrevious } from "./usePrevious";

const useCardLogs = (cardId, isOpen) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const prevSearchQuery = usePrevious(debouncedSearchQuery);
  const isNewSearch =
    typeof prevSearchQuery !== "undefined" &&
    debouncedSearchQuery !== prevSearchQuery;
  const skipQuery = isNewSearch && page !== 1;

  const { data, isFetching, isError } = useGetCardLogsQuery(
    { cardId, page, search: debouncedSearchQuery },
    {
      skip: !isOpen || !cardId || skipQuery,
    }
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

  // Reset state when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSearchQuery("");
    }
  }, [isOpen]);

  return {
    logs: data?.logs || [],
    isFetching,
    isError,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    lastLogElementRef,
  };
};

export default useCardLogs;
