import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetPublicUserByUsernameQuery,
  useGetCardsByAuthorQuery,
} from "../../../api/apiSlice";
import PublicProfilePageSkeleton from "../../../components/ui/skeletons/PublicProfilePageSkeleton";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import CardGridItem from "../../cards/components/CardGridItem";
import ProfileNotFound from "./ProfileNotFound";
import Pagination from "../../../components/ui/Pagination";
import NoCardsPlaceholder from "./NoCardsPlaceholder";
import CardGridSkeleton from "../../../components/ui/skeletons/CardGridSkeleton";

const CARDS_PER_PAGE = 9;

const PublicProfileContent = () => {
  const { username } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: user, isLoading: isLoadingUser } =
    useGetPublicUserByUsernameQuery(username);

  const { data: cardsData, isFetching: isFetchingCards } =
    useGetCardsByAuthorQuery(
      { username: user?.username, page: currentPage, limit: CARDS_PER_PAGE },
      { skip: !user?.username }
    );

  if (isLoadingUser) {
    return <PublicProfilePageSkeleton />;
  }

  if (!user) {
    return <ProfileNotFound username={username} />;
  }

  const totalPages = cardsData?.total
    ? Math.ceil(cardsData.total / CARDS_PER_PAGE)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto 2xl:max-w-7xl p-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <UserCircleIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            @{user.username}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Cards Created
          </h2>
          {isFetchingCards && !cardsData ? (
            <CardGridSkeleton count={CARDS_PER_PAGE} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardsData?.cards && cardsData.cards.length > 0 ? (
                  cardsData.cards.map((card) => (
                    <CardGridItem key={card._id} card={card} showCategory />
                  ))
                ) : (
                  <NoCardsPlaceholder username={user.username} />
                )}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage - 1} // Pagination component is 0-indexed
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page + 1)} // Adjust for 1-based indexing
                    itemsCount={cardsData.total}
                    itemsPerPage={CARDS_PER_PAGE}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileContent;
