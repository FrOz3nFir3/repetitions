import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./configureStore";
import "../styles/main.css";
// import { SpeedInsights } from "@vercel/speed-insights/react";
// import { Analytics } from "@vercel/analytics/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />

    {/* commented as on build mode it's giving syntax error for tracking   */}
    {/* <SpeedInsights />
    <Analytics /> */}
  </Provider>
);
