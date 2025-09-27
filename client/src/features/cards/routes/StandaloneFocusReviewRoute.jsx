import React, { Suspense, lazy, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetFocusReviewDataQuery, apiSlice } from "../../../api/apiSlice";
import { initialCard } from "../state/cardSlice";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import ReviewPageSkeleton from "../../../components/ui/skeletons/ReviewPageSkeleton";
import CardActions from "../components/CardActions";

const FocusReview = lazy(() =>
  import("../components/Flashcard/FocusReviewView")
);
const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

const StandaloneFocusReviewRoute = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // Track if any cards were mastered during focus review session
  const [hasMasteredCards, setHasMasteredCards] = useState(false);

  // Fetch focus review data
  const {
    data: focusReviewData = {},
    isFetching,
    error,
  } = useGetFocusReviewDataQuery(params.id, {
    skip: !user || !params.id,
  });

  // Set card data in Redux store when available
  useEffect(() => {
    if (focusReviewData) {
      dispatch(initialCard(focusReviewData));
    }
  }, [focusReviewData, dispatch]);

  // Handle cache invalidation when navigating away from focus review
  useEffect(() => {
    const currentCardId = params.id;

    // Cleanup function runs when component unmounts or path changes
    return () => {
      // Only handle CSR navigation and if we had mastered cards
      if (currentCardId && hasMasteredCards) {
        // Small delay to ensure we're actually navigating away via CSR
        setTimeout(() => {
          if (!window.location.pathname.includes("/focus-review")) {
            dispatch(
              apiSlice.util.invalidateTags([
                { type: "FocusReviewData", id: currentCardId },
              ])
            );
            // Reset the state for next session
            setHasMasteredCards(false);
          }
        }, 100);
      }
    };
  }, [params.id, dispatch, hasMasteredCards]);

  // Cleanup card state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(initialCard(null));
    };
  }, [dispatch]);

  // Check authentication first - if not authenticated, show RestrictedAccess
  if (!user) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <Breadcrumbs card={focusReviewData} cardData={focusReviewData} />
          <RestrictedAccess description="You need to be logged in to access focus review sessions and track your difficult cards." />
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (isFetching) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <ReviewPageSkeleton />
        </div>
      </div>
    );
  }

  // Handle errors or no data
  if (error || !focusReviewData || !focusReviewData._id) {
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
        <Breadcrumbs card={focusReviewData} cardData={focusReviewData} />

        {/* Full-screen focus review experience */}
        <div className="w-full">
          <Suspense fallback={<ReviewPageSkeleton />}>
            <div className="space-y-6">
              <FocusReview
                card={focusReviewData}
                onCardMastered={() => setHasMasteredCards(true)}
                key={`focus-${focusReviewData?._id}-${
                  focusReviewData?.weakCards?.length || 0
                }`}
              />
              <CardActions showInfo />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StandaloneFocusReviewRoute;
