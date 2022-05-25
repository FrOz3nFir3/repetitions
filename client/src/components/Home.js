import React, { useState } from "react";
import { useGetAllCardsQuery } from "../slice/apiSlice";
import CreatableSelect from "react-select/creatable";
import { Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Home(props) {
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
