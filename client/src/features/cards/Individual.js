import React from "react";
import { useParams } from "react-router-dom";
import { useGetIndividualCardQuery } from "../../api/apiSlice";
import IndividualSkeleton from "../../components/skeletons/IndividualSkeleton";
import FullCard from "./FullCard";
import { initialCard } from "./cardSlice";
import { useDispatch } from "react-redux";

function Individual(props) {
  const params = useParams();
  const { data: card = {}, isFetching } = useGetIndividualCardQuery(params.id);

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(initialCard(card));
  }, [card]);

  if (isFetching) {
    return <IndividualSkeleton />;
  } else {
    // card data is loaded, and we store in it in our redux store
    return <FullCard />;
  }
}

export default Individual;
