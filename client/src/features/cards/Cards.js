import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCardsByCategoryQuery } from "../../api/apiSlice";
import { NewCard } from "./NewCard";
import Loading from "../../components/common/Loading";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function Cards() {
  const { name: category } = useParams();
  const { data = [], isFetching } = useGetCardsByCategoryQuery(category);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Cards in {category}</h1>
          <NewCard category={category} newCard={data.length === 0} />
        </div>
        <CardsBySearch cards={data} />
      </div>
    </div>
  );
}

export function CardsBySearch({ cards }) {
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (event) => setSearchValue(event.target.value.toLowerCase());

  const filteredCards = searchValue.trim()
    ? cards.filter(
        (card) =>
          card["main-topic"].toLowerCase().includes(searchValue) ||
          card["sub-topic"].toLowerCase().includes(searchValue)
      )
    : cards;

  return (
    <div>
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search by Main Topic or Sub Topic"
          value={searchValue}
          onInput={handleSearchChange}
          disabled={cards.length === 0}
          className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No Cards Found</h2>
          <p className="mt-2 text-gray-500">
            {cards.length === 0 ? "Create a new card to get started." : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => (
            <CardDetails key={card._id} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardDetails(data) {
  const {
    _id,
    ["main-topic"]: mainTopic,
    ["sub-topic"]: subTopic,
    review,
    reviewLength = 0,
  } = data;

  return (
    <Link to={`/card/${_id}`} className="block">
      <div className="bg-white rounded-xl shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 truncate">{mainTopic}</h2>
        <p className="text-indigo-600 font-semibold mt-1 truncate">{subTopic}</p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">{review?.length || reviewLength} flashcards</p>
        </div>
      </div>
    </Link>
  );
}

export default Cards;