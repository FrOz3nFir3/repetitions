import { useState, useMemo } from "react";

export const useCardGallerySearch = (review) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReview = useMemo(() => {
    if (!searchTerm) {
      return review;
    }
    return review.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [review, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchReset = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    filteredReview,
    handleSearchChange,
    handleSearchReset,
  };
};
