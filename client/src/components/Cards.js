import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCardsByCategoryQuery } from "../slice/apiSlice";
import { NewCard } from "./NewCard";
import Loading from "./Loading";

function Cards(props) {
  const { name: category } = useParams();
  const { data = [], isFetching } = useGetCardsByCategoryQuery(category);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="flow-content text-center">
      <NewCard category={category} newCard={data.length == 0} />
      <CardsBySearch cards={data} />
    </div>
  );
}

export function CardsBySearch(props) {
  const [searchValue, changeSearch] = React.useState("");
  const filterBySearch = (event) =>
    changeSearch(event.target.value.toLowerCase());

  const cards =
    searchValue.trim().length == 0
      ? props.cards
      : props.cards.filter(filterCards);
  const noCards = props.cards.length == 0;

  return (
    <div className="all-cards">
      <input
        style={{ width: "100%" }}
        type="text"
        placeholder="Search by Main Topic or Sub Topic"
        value={searchValue}
        onInput={filterBySearch}
        disabled={noCards}
      />
      {noCards ? (
        <h2>No Cards</h2>
      ) : (
        <ul className="cards grid-three-columns">{cards.map(cardDetails)}</ul>
      )}
    </div>
  );

  // hoisting
  function filterCards(card) {
    return (
      card["main-topic"].toLowerCase().includes(searchValue) ||
      card["sub-topic"].toLowerCase().includes(searchValue)
    );
  }
}

// hoisting
function cardDetails(data, index) {
  const {
    _id,
    ["main-topic"]: mainTopic,
    ["sub-topic"]: subTopic,
    review,
    reviewLength = 0
  } = data;

  return (
    <li className="bg-blue-france" key={index}>
      <Link to={`/card/${_id}`}>
        <h2>
          {mainTopic.toUpperCase()}: {subTopic.toUpperCase()}
        </h2>
        <p>{review && review.length || reviewLength} cards</p>
      </Link>
    </li>
  );
}

export default Cards;
