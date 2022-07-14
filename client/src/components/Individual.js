import React from "react";
import { useParams } from "react-router-dom";
import { useGetIndividualCardQuery } from "../slice/apiSlice";
import Loading from "./Loading";
import FullCard from "./FullCard";
import cardSlice, {initialCard} from "../slice/cardSlice";
import {useDispatch} from "react-redux";

function Individual(props) {
  const params = useParams();
  const { data: card = {}, isFetching } = useGetIndividualCardQuery(params.id);

  console.log(params.id)
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(initialCard(card));
  }, [card]);

  if (isFetching) {
    return <Loading />;
  }else{
    // card data is loaded, and we store in it in our redux store
    return <FullCard />;
  }


}

export default Individual;
