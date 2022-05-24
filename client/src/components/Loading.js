import React from "react";
import Skeleton from "react-loading-skeleton";

function Loading(props) {
  var { count = 20 } = props;

  return <Skeleton count={count} />;
}

export default Loading;
