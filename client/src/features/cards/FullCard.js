import { CardField } from "./CardField";
import { Link, Outlet } from "react-router-dom";
import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentCard} from "./cardSlice";

function FullCard(props) {
  const card = useSelector(selectCurrentCard);


  const {
    _id,
    "main-topic": mainTopic,
    "sub-topic": subTopic,
    description = "",
    category,
  } = card;

  return (
    <div className="container flow-content">
      <div className="individual-card grid-two-columns">
        <CardField _id={_id} text="main-topic" value={mainTopic} />

        <CardField _id={_id} text="sub-topic" value={subTopic} />

        <CardField _id={_id} text="category" value={category} />

        <CardField _id={_id} text="description" value={description} />
      </div>

      <div style={{ textAlign: "center" }}>
        <Link to={`review`}>
          <button className="btn">Review</button>
        </Link>

        <Link to={`quiz`}>
          <button className="btn">Quiz</button>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
export default FullCard;
