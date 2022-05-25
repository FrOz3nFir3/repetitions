const apiRouter = require("./routes/api.router");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// redirecting to https
const runningInProduction = process.env.NODE_ENV == "production";
app.enable("trust proxy");
app.use((req, res, next) => {
  if (runningInProduction && req.secure == false) {
    res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

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
