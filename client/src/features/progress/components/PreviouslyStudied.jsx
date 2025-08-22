import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import PreviouslyStudiedSkeleton from "../../../components/ui/skeletons/PreviouslyStudiedSkeleton";
import useUserProgressWithSearch from "../../../hooks/useUserProgressWithSearch";
import StudiedDecksHeader from "./StudiedDecksHeader";
import StudiedDecksControls from "./StudiedDecksControls";
import StudiedDecksGrid from "./StudiedDecksGrid";

const PreviouslyStudied = () => {
  const user = useSelector(selectCurrentUser);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    cards: paginatedCards,
    total: totalItemsCount,
    totalPages,
    isFetching,
    isLoading,
    isSearching,
    resetSearch,
  } = useUserProgressWithSearch();

  // Early return for loading state must happen *after* all hooks are called.
  if (isLoading) {
    return <PreviouslyStudiedSkeleton />;
  }

  // Early return for no data only when not searching and no user
  if (!user || (!isSearching && totalItemsCount === 0)) {
    return null;
  }

  return (
    <div className="mb-16">
      <StudiedDecksHeader />
      <StudiedDecksControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={totalItemsCount}
        filteredCount={totalItemsCount}
        isSearching={isSearching}
        resetSearch={resetSearch}
      />
      <StudiedDecksGrid
        paginatedCards={paginatedCards}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        filteredCount={totalItemsCount}
        itemsPerPage={9}
        isFetching={isFetching}
      />
    </div>
  );
};

export default React.memo(PreviouslyStudied);

