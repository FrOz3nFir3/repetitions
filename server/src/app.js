import compression from "compression";
import apiRouter from "./routes/api.router.js";
import healthRouter from "./routes/health.router.js";
import express from "express";
import path from "node:path";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import { accessLimiter } from "./middleware/rateLimiter.middleware.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const __dirname = import.meta.dirname;
const cookieSecret = process.env.COOKIE_SECRET;

// redirecting to https
const runningInProduction = process.env.NODE_ENV == "production";
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (runningInProduction && req.secure == false) {
    res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// needed when developing in development mode
if (!runningInProduction) {
  app.use(
    cors({
      origin: "http://localhost", // Your frontend's origin
      credentials: true,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  );
}

app.use(
  compression({
    // best compression 9
    level: 9,
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

// cookie parser (sending jwt tokens)
app.use(cookieParser(cookieSecret));

// Health check route (fast response, no middleware)
app.use("/health", healthRouter);

// all main api routes here
app.use("/api", apiRouter);

// serving the client here
// allRoutes is the param name given in express 5
app.get("/*allRoutes", accessLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
