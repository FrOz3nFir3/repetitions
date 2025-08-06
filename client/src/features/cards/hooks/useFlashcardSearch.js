import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useFlashcardSearch = (review) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const handleSetSearchParams = (key, value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSetSearchParams("search", value);
    handleSetSearchParams("cardNo", "1"); // Reset to first card on new search
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    handleSetSearchParams("search", "");
    handleSetSearchParams("cardNo", "1");
  };

  const filteredReview = useMemo(() => {
    if (!searchTerm) return review ?? [];
    return (
      review?.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ) ?? []
    );
  }, [review, searchTerm]);

  return {
    searchTerm,
    handleSearchChange,
    handleSearchReset,
    filteredReview,
  };
};
