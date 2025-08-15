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

const app = express();
const __dirname = import.meta.dirname;
const cookieSecret = process.env.COOKIE_SECRET;

// Basic app configuration
const runningInProduction = process.env.NODE_ENV == "production";

// Generate deployment-specific ETag for production only
const deploymentETag = runningInProduction
  ? `"${process.env.VERCEL_GIT_COMMIT_SHA || Date.now()}"`
  : null;

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

// Health check route (no middleware overhead)
app.get("/health", async (req, res) => {
  const { getConnectionStatus } = await import("./services/mongo.js");
  const connectionInfo = getConnectionStatus();

  res.json({
    status: "ok",
    mongodb: connectionInfo.status,
    connectionState: connectionInfo.state,
    isConnected: connectionInfo.isConnected,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Cookie parser for API routes
app.use("/api", cookieParser(cookieSecret));

// CORS only in development
if (!runningInProduction) {
  app.use("/api", async (req, res, next) => {
    const cors = (await import("cors")).default;
    cors({
      origin: "http://localhost",
      credentials: true,
      optionsSuccessStatus: 200,
    })(req, res, next);
  });
}

app.use("/api", apiRouter);

// Client routes with rate limiting
app.get("/*allRoutes", accessLimiter, (req, res) => {
  // Only modify cache headers in production
  if (runningInProduction) {
    res.set("Cache-Control", "no-cache, must-revalidate");
    res.set("ETag", deploymentETag);
  }
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default app;
