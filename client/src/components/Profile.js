import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../slice/authSlice";
import {Link} from "react-router-dom";
import {usePostCardsByIdsMutation} from "../slice/apiSlice";

function Profile(props) {
  const user = useSelector(selectCurrentUser);

  const cardsIds = user && user.studying.map(({card_id})=>card_id);
  const [getCards, { data, isLoading, error }] = usePostCardsByIdsMutation();

 React.useEffect(()=>{
    if(user != null) {
      getCards({cardsIds})
    }
  }, [user])

  if (user == null) {
    return (
      <div className="container text-center">
        <h2>Not logged in</h2>
      </div>
    );
  }
  if(isLoading){
    return <h2>loading...</h2>
  }
    return (
      <div className="container text-center">
        <h2>Email: {user.email}</h2>
        <ul className="flow-content">{user.studying.map(showCardsProgress)}</ul>
      </div>
    );


  // hoisting
  function showCardsProgress(progress, index) {

    const {
      card_id,
      ['total-correct']:correctSoFar,
      ['total-incorrect']:incorrectSoFar,
      ['times-started']:timesStarted,
      ['times-finished']:timesFinished
    } = progress;

    const mainTopic = data && data[index]["main-topic"];
    const subTopic = data && data[index]["sub-topic"];
    const cardsLength = data && data[index]['reviewLength'];
    const category = data && data[index]['category'];

    return <li className="profile-details" key={index}>
      <header>
        <span>Category: {category}</span>
        <h2>Quiz Progress for <Link to={`/card/${card_id}`}>{mainTopic}:{subTopic}</Link> </h2>
      </header>

      <p><span>Total Flashcards: {cardsLength}</span> | <span>Times Started: {timesStarted}</span> | <span>Times finished: {timesFinished}</span></p>
      <p className="bg-dark-green">Correct Answers: {correctSoFar} </p>
      <p className="bg-error">Incorrect Answers: {incorrectSoFar}</p>
    </li>
  }
  }

export default Profile;
