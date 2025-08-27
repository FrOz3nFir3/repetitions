import React, { Suspense, lazy, useEffect } from "react";
import ReviewPageSkeleton from "../../../components/ui/skeletons/ReviewPageSkeleton";
import CardActions from "../components/CardActions";
import { useDispatch, useSelector } from "react-redux";
import { initialCard, selectCurrentCard } from "../state/cardSlice";

const Review = lazy(() => import("../components/Flashcard/ReviewView"));

const ReviewRoute = () => {
  const card = useSelector(selectCurrentCard);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(initialCard(null));
    };
  }, []);

  if (!card?._id) return <ReviewPageSkeleton />;

  return (
    <Suspense fallback={<ReviewPageSkeleton />}>
      <div className="space-y-6">
        <Review card={card} key={card?._id} />
        <CardActions showInfo />
      </div>
    </Suspense>
  );
};

export default ReviewRoute;
