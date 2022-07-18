import React, { useState } from "react";
import {useGetAllCardsQuery, usePostCardsByIdsMutation} from "../slice/apiSlice";
import CreatableSelect from "react-select/creatable";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../slice/authSlice";
import {cardDetails, CardsBySearch} from "./Cards";

function Home(props) {
  const user = useSelector(selectCurrentUser);

  const cardsIds = user && user.studying.map(({card_id})=>card_id);
  const [getCards, { data:studyingCards = [], isLoading, error }] = usePostCardsByIdsMutation();

  React.useEffect(()=>{
    if(user != null) {
      getCards({cardsIds})
    }
  }, [user])

  const navigate = useNavigate();
  const { data: allCards = [], isFetching } = useGetAllCardsQuery();
  const options = allCards.map(createDropDownOptions);

  const params = useParams();
  const defaultCategory = options.find(({ value }) => value == params.name);
  const [selectedOption, setSelectedOption] = useState(defaultCategory);

  const changeCategory = (option) => {
    if (option == null) {
      return setSelectedOption(option);
    }
    const creatingNew = typeof option == "string";
    const name = creatingNew ? option : option.value;
    navigate(`category/${name}`, { replace: true });
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <>
      <div className="container flow-content">
        <CreatableSelect
          isClearable
          onChange={changeCategory}
          onCreateOption={changeCategory}
          options={options}
          placeholder="Select / Create a Category"
          value={defaultCategory}
        />
        <Outlet />
        {user &&
          <div>
            <h3>Previously Studied Cards: </h3>
            <CardsBySearch cards={studyingCards}/>
          </div>
        }

      </div>
    </>
  );
}

function createDropDownOptions(category) {
  return {
    value: category,
    label: category,
  };
}

export default Home;
