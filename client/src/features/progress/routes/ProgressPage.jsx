import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import { useGetUserProgressQuery } from "../../../api/apiSlice";
import ProgressPageSkeleton from "../../../components/ui/skeletons/ProgressPageSkeleton";
import DetailedReportModal from "../components/DetailedReportModal";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import OverallStats from "../components/OverallStats";
import DeckProgressList from "../components/DeckProgressList";
import ProgressPageHeader from "../components/ProgressPageHeader";
import EmptyState from "../components/ui/EmptyState";
import { RocketLaunchIcon } from "@heroicons/react/24/outline";

function ProgressPage() {
  const user = useSelector(selectCurrentUser);
  const { data: studyingCards, isLoading } = useGetUserProgressQuery(
    undefined,
    {
      skip: !user?.email,
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

  if (!user && !isLoading) {
    return (
      <RestrictedAccess description="You need to be logged in to view your progress and track your learning journey." />
    );
  }

  if (isLoading) {
    return <ProgressPageSkeleton />;
  }

  const totalDecksStudied = user.studying?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Header */}
          <ProgressPageHeader user={user} />

          {/* Overall Stats Component */}
          <div className="mb-12">
            <OverallStats user={user} />
          </div>

          {/* Decks Section */}
          <div className="mb-16">
            {totalDecksStudied > 0 ? (
              <DeckProgressList
                user={user}
                studyingCards={studyingCards}
                onViewReport={handleViewReport}
              />
            ) : (
              <EmptyState
                title="Ready to Start Learning?"
                message="Your learning journey begins with your first quiz. Choose a deck and start building your knowledge!"
                ctaText="Explore Learning Decks"
                ctaLink="/category"
                icon={RocketLaunchIcon}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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
