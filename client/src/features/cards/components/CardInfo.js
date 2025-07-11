import React from "react";
import { CardField } from "./CardField";
import CardMetaInfo from "./CardMetaInfo";

const CardInfo = ({ card }) => {
  const {
    _id,
    "main-topic": mainTopic,
    "sub-topic": subTopic,
    description = "",
    category,
  } = card;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Card Details
      </h2>
      <CardField _id={_id} text="main-topic" value={mainTopic} />
      <CardField _id={_id} text="sub-topic" value={subTopic} />
      <CardField _id={_id} text="category" value={category} />
      <CardField _id={_id} text="description" value={description} />
      <CardMetaInfo card={card} />
    </div>
  );
};

export default CardInfo;
