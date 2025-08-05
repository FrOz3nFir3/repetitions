import mongoose from "mongoose";

const CONNECTION_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export function healthCheck(req, res, next) {
  const connectionState = mongoose.connection.readyState;
  const mongoStatus = CONNECTION_STATES[connectionState];

  // Allow health checks and static files regardless of MongoDB state
  if (req.path === "/health" || req.path.startsWith("/api/health")) {
    return res.json({
      status: "ok",
      mongodb: mongoStatus,
    });
  }

  // For API routes that need MongoDB, check connection state
  if (req.path.startsWith("/api")) {
    switch (connectionState) {
      case 1: // connected
        break; // continue to next middleware
      case 2: // connecting
        return res.status(503).json({
          error: "Service temporarily unavailable - database connecting",
          mongodb: mongoStatus,
        });
      case 0: // disconnected
      case 3: // disconnecting
      default:
        return res.status(503).json({
          error: "Service unavailable - database disconnected",
          mongodb: mongoStatus,
        });
    }
  }

  next();
}
