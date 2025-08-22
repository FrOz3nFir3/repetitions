import { useState, useEffect } from "react";
import { useGetCategoriesPaginatedQuery } from "../api/apiSlice";
import { useDebounce } from "./useDebounce";

const useCategoriesWithSearch = () => {
  const [searchQuery, _setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // When setting the search query, we must also reset the page to 1
  const setSearchQuery = (value) => {
    _setSearchQuery(value);
    setCurrentPage(1);
  };

  const { data, isFetching, isLoading, error, refetch } =
    useGetCategoriesPaginatedQuery({
      page: currentPage,
      limit: 12,
      search: debouncedSearchQuery,
    });

  const categories = data?.categories || [];
  const total = data?.total || 0;
  const hasMore = data?.hasMore || false;
  const totalPages = Math.ceil(total / 12);

  const resetSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    categories,
    total,
    hasMore,
    totalPages,
    isFetching,
    isLoading,
    error,
    resetSearch,
    refetch,
    isSearching: debouncedSearchQuery.trim().length > 0,
  };
};

export default useCategoriesWithSearch;

