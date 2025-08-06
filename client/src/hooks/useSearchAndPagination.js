import { useState, useMemo, useEffect } from "react";

const useSearchAndPagination = (
  items,
  itemsPerPage,
  filterFn,
  initialSearchQuery = ""
) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to the first page whenever the search query or the source items change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (!searchQuery.trim()) return items;
    return items.filter((item) => filterFn(item, searchQuery.toLowerCase()));
  }, [items, searchQuery, filterFn]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    filteredItemsCount: filteredItems.length,
    totalItemsCount: items.length,
  };
};

export default useSearchAndPagination;
