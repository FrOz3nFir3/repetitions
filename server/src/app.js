// Fast environment loading
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Core imports - load upfront for better response times
import express from "express";
import path from "node:path";
import compression from "compression";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/api.router.js";
import { accessLimiter } from "./middleware/rateLimiter.middleware.js";
import helmet from "helmet";
import cors from "cors";

const app = express();
const __dirname = import.meta.dirname;
const cookieSecret = process.env.COOKIE_SECRET;

// Basic app configuration
const runningInProduction = process.env.NODE_ENV == "production";

// Generate deployment-specific ETag for production only
const deploymentETag = runningInProduction
  ? `"${process.env.VERCEL_GIT_COMMIT_SHA || Date.now()}"`
  : null;

// helmet js for fixing common vulnerabilities
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://accounts.google.com"],
        "frame-src": [
          "'self'",
          "https://accounts.google.com",
          "https://www.googleapis.com",
        ],
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://www.googleapis.com",
        ],
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// HTTPS redirect first
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (runningInProduction && req.secure == false) {
    res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

// Compression for static files
app.use((req, res, next) => {
  // Skip compression for API routes
  if (req.path.startsWith("/api")) {
    return next();
  }

  compression({
    level: 9,
    threshold: 1024, // Only compress files > 1KB
  })(req, res, next);
});

// Essential middleware
app.use(express.json({ limit: "10mb" })); // Add limit for security
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    setHeaders: function (res, filePath) {
      // Only modify cache headers in production
      if (runningInProduction && path.basename(filePath) === "index.html") {
        res.setHeader("Cache-Control", "no-cache, must-revalidate");
        res.setHeader("ETag", deploymentETag);
      }
    },
  })
);

// Cookie parser for API routes
app.use("/api", cookieParser(cookieSecret));

// CORS configuration
const corsOptions = {
  origin: runningInProduction
    ? "https://repetitions.learnapp.workers.dev"
    : "http://localhost",
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use("/api", cors(corsOptions));

app.use("/api", accessLimiter, apiRouter);

// this will only run in development mode
if (!runningInProduction) {
  app.get("/*allRoutes", accessLimiter, (req, res) => {
    res.set("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
}

export default app;
