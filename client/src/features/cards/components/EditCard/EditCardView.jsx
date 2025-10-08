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

  // Get current view to determine which data to fetch
  const currentView = searchParams.get("view") || "flashcards";

  // Always fetch overview data (with skipLogs for edit views)
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "overview",
  });

  // Fetch view-specific data based on current view
  const getViewType = () => {
    if (currentView === "flashcards") return "review";
    if (currentView === "quizzes") return "quiz";
    if (currentView === "review-queue") return "review-queue";
    return "review";
  };

  const {
    data: viewData,
    isLoading: isViewLoading,
    error: viewError,
    isFetching: isViewFetching,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: getViewType(),
  });

  // Merge overview and view-specific data
  const mergedCard = useMemo(() => {
    if (!overviewData) return card;

    const merged = { ...overviewData };

    // Merge view-specific data
    if (viewData) {
      if (currentView === "flashcards" && viewData.review) {
        merged.review = viewData.review;
      } else if (currentView === "quizzes" && viewData.quizzes) {
        merged.quizzes = viewData.quizzes;
      } else if (currentView === "review-queue" && viewData.reviewQueue) {
        merged.reviewQueue = viewData.reviewQueue;
      }
    }

    return merged;
  }, [overviewData, viewData, currentView, card]);

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
  } = useEditCardManager(mergedCard || card);

  const reviewMap = useMemo(() => {
    const map = new Map();
    const reviewArray = mergedCard?.review || review || [];
    reviewArray.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [mergedCard, review]);

  const quizMap = useMemo(() => {
    const map = new Map();
    const quizzesArray = mergedCard?.quizzes || quizzes || [];
    quizzesArray.forEach((item, index) => {
      map.set(item._id, index);
    });
    return map;
  }, [mergedCard, quizzes]);

  // Show loading state
  if (isOverviewLoading || isViewLoading) {
    return <EditCardPageSkeleton />;
  }

  // Show error state
  if (overviewError || viewError) {
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
            Failed to load card data
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There was an error loading the card data. Please try refreshing the
            page.
          </p>
        </div>
      </div>
    );
  }

  if (!mergedCard && !card) {
    return <EditCardPageSkeleton />;
  }

  const displayCard = mergedCard || card;

  const displayReview = displayCard?.review || review || [];
  const displayQuizzes = displayCard?.quizzes || quizzes || [];
  const displayReviewQueue = displayCard?.reviewQueue || reviewQueue || [];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <EditCardHeader
        flashcardId={displayCard?._id || _id}
        view={view}
        setSearchParams={setSearchParams}
      />
      <ViewSwitcher
        view={view}
        setSearchParams={setSearchParams}
        totalFlashcards={displayCard?.reviewLength ?? displayReview.length}
        totalQuizzes={displayCard?.quizzesLength ?? displayQuizzes.length}
        totalReviewQueue={
          displayCard?.reviewQueueLength ?? displayReviewQueue.length
        }
      />

      {view === "flashcards" ? (
        <FlashcardManagementView
          review={displayReview}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleJump={handleJump}
          currentIndex={currentIndex}
          totalCount={filteredFlashcards.length}
          currentFlashcard={currentItem}
          cardId={displayCard?._id || _id}
          animationDirection={animationDirection}
          originalFlashcardIndex={originalFlashcardIndex}
          filteredFlashcards={filteredFlashcards}
          handleIndexChange={handleIndexChange}
          reviewMap={reviewMap}
        />
      ) : view === "quizzes" ? (
        <QuizManagementView
          quizzes={displayQuizzes}
          cardId={displayCard?._id || _id}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleReset={handleReset}
          currentIndex={currentIndex}
          handleIndexChange={handleIndexChange}
          initialFilteredQuizzes={filteredQuizzes}
          handleNext={handleNext}
          handlePrev={handlePrev}
          review={displayReview}
          quizMap={quizMap}
        />
      ) : view === "review-queue" ? (
        <ReviewQueueView
          cardId={displayCard?._id || _id}
          reviewQueue={displayReviewQueue}
          reviewQueueLength={displayCard?.reviewQueueLength}
        />
      ) : null}
    </div>
  );
};

export default EditCardView;
