const apiRouter = require("./routes/api.router");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// needed when developing in development mode
app.use(
  cors({
    origin: "http://localhost",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// cookie parser (sending jwt tokens)
app.use(cookieParser());

// all main api routes here
app.use("/api", apiRouter);

// serving the client here
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
