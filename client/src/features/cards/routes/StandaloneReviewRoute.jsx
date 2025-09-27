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

  // Fetch card data for review
  const {
    data: cardData,
    isFetching,
    error,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "review",
  });

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
  if (error || !cardData || !cardData._id) {
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
