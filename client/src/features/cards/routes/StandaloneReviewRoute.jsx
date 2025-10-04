import React, { Suspense, lazy, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import { initialCard } from "../state/cardSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import ReviewPageSkeleton from "../../../components/ui/skeletons/ReviewPageSkeleton";
import CardActions from "../components/CardActions";

const Review = lazy(() => import("../components/Flashcard/ReviewView"));
const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

const StandaloneReviewRoute = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Fetch overview data (metadata + counts)
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "overview",
  });

  // Fetch review-specific data (flashcards)
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    error: reviewError,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "review",
  });

  // Merge the data
  const cardData = React.useMemo(() => {
    // If review data is cached but overview is loading, use review data
    if (reviewData && !overviewData) {
      return {
        _id: reviewData._id,
        review: reviewData.review || [],
      };
    }

    if (!overviewData) return null;

    // Return partial data if review data is still loading
    if (!reviewData) {
      return {
        ...overviewData,
        review: [], // Empty array while loading
      };
    }

    return {
      ...overviewData,
      review: reviewData.review || [],
    };
  }, [overviewData, reviewData]);

  // Set card data in Redux store when available
  useEffect(() => {
    if (cardData) {
      dispatch(initialCard(cardData));
    }
  }, [cardData, dispatch]);

  // Cleanup card state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(initialCard(null));
    };
  }, [dispatch]);

  // Show loading skeleton ONLY if BOTH are loading (initial load)
  // If review data is cached, don't block rendering
  if ((isOverviewLoading && isReviewLoading) || isReviewLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <ReviewPageSkeleton />
        </div>
      </div>
    );
  }

  // Handle errors or no data
  if (overviewError || reviewError || !cardData) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto 2xl:max-w-7xl p-4">
        <Breadcrumbs card={cardData} cardData={cardData} />

        {/* Full-screen review experience */}
        <div className="w-full">
          <Suspense fallback={<ReviewPageSkeleton />}>
            <div className="space-y-6">
              {/* Use stable key to prevent unnecessary remounts */}
              <Review card={cardData} key={`review-${cardData._id}`} />
              <CardActions showInfo />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StandaloneReviewRoute;
