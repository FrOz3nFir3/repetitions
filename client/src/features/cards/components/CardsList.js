import React from "react";
import { useParams } from "react-router-dom";
import { useGetCardsByCategoryQuery } from "../../../api/apiSlice";
import { NewCardForm } from "./NewCardForm";
import CardSkeleton from "../../../components/ui/skeletons/CardSkeleton";
import SearchableCardGrid from "./SearchableCardGrid";

const CardList = () => {
  const { name: category } = useParams();
  const { data = [], isFetching } = useGetCardsByCategoryQuery(category);

  if (isFetching) {
    return <CardSkeleton />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Cards in {category}
          </h1>
          <NewCardForm category={category} newCard={data.length === 0} />
        </div>
        <SearchableCardGrid cards={data} />
      </div>
    </div>
  );
};
export default CardList;
