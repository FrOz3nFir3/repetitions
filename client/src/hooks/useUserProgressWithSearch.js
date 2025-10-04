import { useState, useEffect } from "react";
import { useGetUserProgressPaginatedQuery } from "../api/apiSlice";
import { useDebounce } from "./useDebounce";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/authentication/state/authSlice";

const useUserProgressWithSearch = () => {
  const user = useSelector(selectCurrentUser);
  const [searchQuery, _setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // When setting the search query or category, we must also reset the page to 1
  const setSearchQuery = (value) => {
    _setSearchQuery(value);
    setCurrentPage(1);
  };

  const { data, isFetching, isLoading, error, refetch } =
    useGetUserProgressPaginatedQuery(
      {
        page: currentPage,
        search: debouncedSearchQuery,
      },
      {
        skip: !user || !user.studyingCount,
      }
    );

  const cards = data?.cards || [];
  const total = data?.total || 0;
  const hasMore = data?.hasMore || false;
  const totalPages = Math.ceil(total / 9);

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const resetSearch = () => {
    _setSearchQuery("");
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    cards,
    total,
    hasMore,
    totalPages,
    isFetching,
    isLoading,
    error,
    loadMore,
    resetSearch,
    refetch,
    isSearching: debouncedSearchQuery.trim().length > 0,
  };
};

export default useUserProgressWithSearch;
