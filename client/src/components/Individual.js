import React from "react";
import { useParams } from "react-router-dom";
import { useGetIndividualCardQuery } from "../slice/apiSlice";

import Loading from "./Loading";
import FullCard from "./FullCard";

function Individual(props) {
  const params = useParams();
  const { data: card = {}, isFetching } = useGetIndividualCardQuery(params.id);

  if (isFetching) {
    return <Loading />;
  }
  return <FullCard card={card} />;
}

export default Individual;
