import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";
import {Link} from "react-router-dom";

function Profile(props) {
  let user = useSelector(selectCurrentUser);
  if (user == null) {
    return (
      <div className="container text-center">
        <h2>Not logged in</h2>
      </div>
    );
  }
  return (
    <div className="container text-center">
      <h2>Email: {user.email}</h2>
      <ul className="flow-content">{user.studying.map(showCardsProgress)}</ul>
    </div>
  );
}
function showCardsProgress(progress, index) {

  const {
    card_id,
    ['total-correct']:correctSoFar,
    ['total-incorrect']:incorrectSoFar,
    ['times-started']:timesStarted,
    ['times-finished']:timesFinished
  } = progress

  return <li className="profile-details" key={index}>
      <h2>Your Quiz Progress for <Link to={`/card/${card_id}`}>Card</Link> </h2>
       <p><span>Times Started: {timesStarted}</span> | <span>Times finished: {timesFinished}</span></p>
      <p className="bg-dark-green">Correct Answers: {correctSoFar} </p>
      <p className="bg-error">Incorrect Answers: {incorrectSoFar}</p>
  </li>
}
export default Profile;
