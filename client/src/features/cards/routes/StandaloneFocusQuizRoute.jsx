import React, { Suspense, lazy, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetFocusQuizDataQuery, apiSlice } from "../../../api/apiSlice";
import { initialCard } from "../state/cardSlice";
import { selectCurrentUser } from "../../authentication/state/authSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import RestrictedAccess from "../../../components/ui/RestrictedAccess";
import ReviewPageSkeleton from "../../../components/ui/skeletons/ReviewPageSkeleton";
import QuizPageSkeleton from "../../../components/ui/skeletons/QuizPageSkeleton";
import CardActions from "../components/CardActions";

const FocusQuiz = lazy(() =>
  import("../components/Quiz/FocusQuizView")
);
const NotFound = lazy(() =>
  import("../../../features/not-found/components/NotFound")
);

const StandaloneFocusQuizRoute = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  // Track if any quizzes were mastered during focus quiz session
  const [hasMasteredQuizzes, setHasMasteredQuizzes] = useState(false);

  // Fetch focus quiz data
  const {
    data: focusQuizData = {},
    isFetching,
    error,
  } = useGetFocusQuizDataQuery(params.id, {
    skip: !user || !params.id,
  });

  // Set card data in Redux store when available
  useEffect(() => {
    if (focusQuizData) {
      dispatch(initialCard(focusQuizData));
    }
  }, [focusQuizData, dispatch]);

  // Handle cache invalidation when navigating away from focus quiz
  useEffect(() => {
    const currentCardId = params.id;

    // Cleanup function runs when component unmounts or path changes
    return () => {
      // Only handle CSR navigation and if we had mastered quizzes
      if (currentCardId && hasMasteredQuizzes) {
        // Small delay to ensure we're actually navigating away via CSR
        setTimeout(() => {
          if (!window.location.pathname.includes("/focus-quiz")) {
            dispatch(
              apiSlice.util.invalidateTags([
                { type: "FocusQuizData", id: currentCardId },
              ])
            );
            // Reset the state for next session
            setHasMasteredQuizzes(false);
          }
        }, 100);
      }
    };
  }, [params.id, dispatch, hasMasteredQuizzes]);

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
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <Breadcrumbs card={focusQuizData} cardData={focusQuizData} />
          <RestrictedAccess description="You need to be logged in to access focus quiz sessions and track your difficult quizzes." />
        </div>
      </div>
    );
  }

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
  if (error || !focusQuizData || !focusQuizData._id) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <NotFound />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Breadcrumbs card={focusQuizData} cardData={focusQuizData} />

        {/* Full-screen focus quiz experience */}
        <div className="w-full">
          <Suspense fallback={<QuizPageSkeleton />}>
            <div className="space-y-6">
              <FocusQuiz
                card={focusQuizData}
                onQuizMastered={() => setHasMasteredQuizzes(true)}
                key={`focus-quiz-${focusQuizData?._id}-${
                  focusQuizData?.strugglingQuizzes?.length || 0
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

export default StandaloneFocusQuizRoute;