import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
import dotenv from "dotenv";

// Load env first for faster access
const runningInProduction = process.env.NODE_ENV == "production";
if (!runningInProduction) {
  dotenv.config({ path: "../.env" });
}
// Set DNS servers for faster MongoDB Atlas resolution
setServers(["1.1.1.1", "8.8.8.8"]);

// Update below to match your own MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

export async function mongoConnect() {
  // Skip if already connected
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  // Connect to MongoDB
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 30,
    minPoolSize: 10,
    compressors: "zlib",
    bufferCommands: false, // Don't buffer commands if not connected
    maxIdleTimeMS: 900000, // 15 minutes
  });
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}

// Initialize MongoDB connection with timing and error handling
export const initMongoDB = async () => {
  const startTime = Date.now();

  try {
    console.log("Initializing MongoDB connection...");
    await mongoConnect();

    if (mongoose.connection.readyState === 1) {
      console.log(`MongoDB ready in ${Date.now() - startTime}ms`);
    }
  } catch (err) {
    console.error(
      `MongoDB connection failed after ${Date.now() - startTime}ms:`,
      err.message
    );
    console.error("App starting without database - API requests may fail");
  }
};

// Get current connection status
export const getConnectionStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return {
    state: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState],
    isConnected: mongoose.connection.readyState === 1,
  };
};

// Force reconnection (useful for testing or recovery)
export const forceReconnect = async () => {
  console.log("Forcing MongoDB reconnection...");
  await mongoDisconnect();
  return await initMongoDB();
};
