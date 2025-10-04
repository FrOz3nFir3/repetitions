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

  // Fetch overview data (metadata + counts)
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "overview",
  });

  // Fetch quiz-specific data
  const {
    data: quizData,
    isLoading: isQuizLoading,
    error: quizError,
  } = useGetIndividualCardQuery({
    id: params.id,
    view: "quiz",
  });

  // Merge the data
  const cardData = React.useMemo(() => {
    // If quiz data is cached but overview is loading, use quiz data
    if (quizData && !overviewData) {
      return {
        _id: quizData._id,
        quizzes: quizData.quizzes || [],
      };
    }

    if (!overviewData) return null;

    // Return partial data if quiz data is still loading
    if (!quizData) {
      return {
        ...overviewData,
        quizzes: [], // Empty array while loading
      };
    }

    return {
      ...overviewData,
      quizzes: quizData.quizzes || [],
    };
  }, [overviewData, quizData]);

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
  // If quiz data is cached, don't block rendering
  if ((isOverviewLoading && isQuizLoading) || isQuizLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <QuizPageSkeleton />
        </div>
      </div>
    );
  }

  // Handle errors or no data
  if (quizError || !cardData) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto 2xl:max-w-7xl p-4">
          <Breadcrumbs card={cardData} cardData={cardData} />
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto 2xl:max-w-7xl p-4">
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
