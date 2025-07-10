import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { Link } from "react-router-dom";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import ProgressPageSkeleton from "../../../components/ui/skeletons/ProgressPageSkeleton";
import DetailedReportModal from "../components/DetailedReportModal"; // Assuming this will be created
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import OverallStats from "../components/OverallStats";
import DeckProgressCard from "../components/DeckProgressCard";

function ProgressPage() {
  const user = useSelector(selectCurrentUser);
  const { data: studyingCards, isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user,
    }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleViewReport = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  if (isLoading) {
    return <ProgressPageSkeleton />;
  }

  if (!user && !isLoading) {
    return (
      <RestrictedAccess
        description={`You need to be logged in to view your progress and track your progress.`}
      />
    );
  }
  const totalDecksStudied = user.studying.length;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 !py-12">
        <header className="my-10">
          <h2 className="!mb-4 text-4xl font-extrabold text-gray-900 dark:text-white">
            Your Progress
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">{user.email}</span>!
            Here's a look at your progress.
          </p>
        </header>

        <OverallStats user={user} />

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white !mb-4">
            Your Decks
          </h2>
          {totalDecksStudied > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {user.studying.map((progress, index) => (
                <DeckProgressCard
                  key={progress.card_id}
                  progress={progress}
                  cardDetails={studyingCards ? studyingCards[index] : null}
                  onViewReport={handleViewReport}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                You haven't studied any decks yet.
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                Once you start a quiz, your progress will appear here.
              </p>
              <Link
                to="/category"
                className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                Find a Deck to Study
              </Link>
            </div>
          )}
        </div>
      </div>
      {selectedCard && (
        <DetailedReportModal
          isOpen={isModalOpen}
          cardId={selectedCard.card_id}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ProgressPage;
