import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import PreviouslyStudiedSkeleton from "../../../components/ui/skeletons/PreviouslyStudiedSkeleton";
import useSearchAndPagination from "../../../hooks/useSearchAndPagination";
import StudiedDecksHeader from "./StudiedDecksHeader";
import StudiedDecksControls from "./StudiedDecksControls";
import StudiedDecksGrid from "./StudiedDecksGrid";

const CARDS_PER_PAGE = 9;

const studiedCardFilterFn = (card, query) =>
  card["main-topic"]?.toLowerCase().includes(query) ||
  card["sub-topic"]?.toLowerCase().includes(query) ||
  card.category?.toLowerCase().includes(query);

const PreviouslyStudied = () => {
  const user = useSelector(selectCurrentUser);
  // CRITICAL FIX: Default studyingCards to an empty array `[]` to ensure hooks always receive valid data.
  const { data: studyingCards = [], isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user,
    }
  );

  const [selectedCategory, setSelectedCategory] = useState("All");

  // This logic now correctly filters the data *before* it's passed to the pagination hook.
  const categoryFilteredCards = useMemo(() => {
    if (selectedCategory === "All") return studyingCards;
    return studyingCards.filter((card) => card.category === selectedCategory);
  }, [studyingCards, selectedCategory]);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    filteredItemsCount,
  } = useSearchAndPagination(
    categoryFilteredCards,
    CARDS_PER_PAGE,
    studiedCardFilterFn
  );

  // Early return for loading state must happen *after* all hooks are called.
  if (isLoading) {
    return <PreviouslyStudiedSkeleton />;
  }

  // Early return for no data state must also happen *after* hooks.
  if (!user || !studyingCards || studyingCards.length === 0) {
    return null;
  }

  const categories = [
    "All",
    ...new Set(studyingCards.map((card) => card.category)),
  ];

  return (
    <div className="mb-16">
      <StudiedDecksHeader />
      <StudiedDecksControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalCount={studyingCards.length}
        filteredCount={filteredItemsCount}
      />
      <StudiedDecksGrid
        paginatedCards={paginatedItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        filteredCount={filteredItemsCount}
        itemsPerPage={CARDS_PER_PAGE}
      />
    </div>
  );
};

export default React.memo(PreviouslyStudied);
