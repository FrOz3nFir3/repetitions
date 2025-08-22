import { useState, useEffect } from "react";
import { useGetCardsByCategoryPaginatedQuery } from "../api/apiSlice";
import { useDebounce } from "./useDebounce";

const useCardsWithSearch = (category) => {
  const [searchQuery, _setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // When setting the search query, we must also reset the page to 1
  const setSearchQuery = (value) => {
    _setSearchQuery(value);
    setCurrentPage(1);
  };

  const { data, isFetching, isLoading, error, refetch } =
    useGetCardsByCategoryPaginatedQuery({
      category,
      page: currentPage,
      limit: 9,
      search: debouncedSearchQuery,
    });

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
    setSearchQuery("");
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

export default useCardsWithSearch;

