import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { selectCurrentCard } from "../../state/cardSlice";
import { useGetIndividualCardQuery } from "../../../../api/apiSlice";
import EditCardHeader from "./EditCardHeader";
import QuizManagementView from "./QuizManagementView";
import FlashcardManagementView from "./FlashcardManagementView";
import ReviewQueueView from "./ReviewQueueView";
import ViewSwitcher from "./ViewSwitcher";
import { useEditCardManager } from "../../hooks/useEditCardManager";
import EditCardPageSkeleton from "../../../../components/ui/skeletons/EditCardPageSkeleton";

const EditCardView = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const card = useSelector(selectCurrentCard);
  const { _id, review = [], quizzes = [], reviewQueue = [] } = card || {};

  // Get current view to determine if we need to fetch review queue data
  const currentView = searchParams.get("view") || "flashcards";

  // Get the appropriate view type for API call
  const getCardViewType = () => {
    if (currentView === "flashcards") return "edit_flashcards";
    if (currentView === "quizzes") return "edit_quizzes";
    if (currentView === "review-queue") return "edit_flashcards"; // Use edit_flashcards to get review queue data
    return "edit_flashcards";
  };

  // Fetch card data specifically for review queue when needed
  const {
    isLoading: isCardLoading,
    error: cardError,
    isFetching: isCardFetching,
  } = useGetIndividualCardQuery(
    {
      id: params.id,
      view: getCardViewType(),
    },
    {
      // Only refetch if we're on review queue view and don't have review queue data
      skip:
        currentView !== "review-queue" ||
        (card && card.reviewQueue !== undefined),
    }
  );

  const {
    view,
    setSearchParams,
    searchTerm,
    currentIndex,
    animationDirection,
    filteredFlashcards,
    filteredQuizzes,
    currentItem,
    originalFlashcardIndex,
    handleSearchChange,
    handleReset,
    handlePrev,
    handleNext,
    handleJump,
    handleIndexChange,
  } = useEditCardManager(card);

  const reviewMap = useMemo(() => {
    const map = new Map();
    review.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [review]);

  const quizMap = useMemo(() => {
    const map = new Map();
    quizzes.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [quizzes]);

  // Show loading state for review queue data
  if (currentView === "review-queue" && (isCardLoading || isCardFetching)) {
    return <EditCardPageSkeleton />;
  }

  // Show error state for review queue
  if (currentView === "review-queue" && cardError) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Failed to load review queue
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There was an error loading the review queue data. Please try
            refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!card) {
    return <EditCardPageSkeleton />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <EditCardHeader
        flashcardId={_id}
        view={view}
        setSearchParams={setSearchParams}
      />
      {/* TODO: fix this later to match the exact new flashcards count */}
      <ViewSwitcher
        view={view}
        setSearchParams={setSearchParams}
        totalFlashcards={card?.reviewLength ?? review.length}
        totalQuizzes={card?.quizzesLength ?? quizzes.length}
        totalReviewQueue={card?.reviewQueueLength ?? reviewQueue.length}
      />

      {view === "flashcards" ? (
        <FlashcardManagementView
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleJump={handleJump}
          currentIndex={currentIndex}
          totalCount={filteredFlashcards.length}
          currentFlashcard={currentItem}
          cardId={_id}
          animationDirection={animationDirection}
          originalFlashcardIndex={originalFlashcardIndex}
          filteredFlashcards={filteredFlashcards}
          handleIndexChange={handleIndexChange}
          reviewMap={reviewMap}
        />
      ) : view === "quizzes" ? (
        <QuizManagementView
          quizzes={quizzes}
          cardId={_id}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          currentIndex={currentIndex}
          handleIndexChange={handleIndexChange}
          initialFilteredQuizzes={filteredQuizzes}
          handleNext={handleNext}
          handlePrev={handlePrev}
          review={review}
          quizMap={quizMap}
        />
      ) : view === "review-queue" ? (
        <ReviewQueueView cardId={_id} />
      ) : null}
    </div>
  );
};

export default EditCardView;
