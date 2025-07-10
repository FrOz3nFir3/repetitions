import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Loading(props) {
  var { count = 20 } = props;

  // It's a bit of a hack, but we can determine the theme from the html element
  const isDarkMode = document.documentElement.classList.contains("dark");

  return (
    <Skeleton
      count={count}
      baseColor={isDarkMode ? "#2D3748" : "#E2E8F0"}
      highlightColor={isDarkMode ? "#4A5568" : "#F7FAFC"}
    />
  );
}

export default Loading;
