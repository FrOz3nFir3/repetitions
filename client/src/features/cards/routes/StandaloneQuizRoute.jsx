import React, { Suspense, lazy, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetIndividualCardQuery } from "../../../api/apiSlice";
import { initialCard } from "../state/cardSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import QuizPageSkeleton from "../../../components/ui/skeletons/QuizPageSkeleton";
import CardActions from "../components/CardActions";

const Quiz = lazy(() => import("../components/Quiz/QuizView"));
const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

const StandaloneQuizRoute = () => {
  const params = useParams();
  const dispatch = useDispatch();

  // Fetch card data for quiz
  const { data: cardData, isFetching, error } = useGetIndividualCardQuery({
    id: params.id,
    view: "quiz",
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
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <QuizPageSkeleton />
        </div>
      </div>
    );
  }

  // Handle errors or no data
  if (error || !cardData || !cardData._id) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Breadcrumbs card={cardData} cardData={cardData} />
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumbs card={cardData} cardData={cardData} />

        {/* Full-screen quiz experience */}
        <div className="w-full">
          <Suspense fallback={<QuizPageSkeleton />}>
            <div className="space-y-6">
              <Quiz />
              <CardActions showInfo />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StandaloneQuizRoute;