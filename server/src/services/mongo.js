import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
import dotenv from "dotenv";

// Load env first for faster access
dotenv.config({ path: "../.env" });

// Set DNS servers for faster MongoDB Atlas resolution
setServers(["1.1.1.1", "8.8.8.8"]);

// Update below to match your own MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

// Global connection promise to cache across serverless invocations
let cachedConnection = null;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
  cachedConnection = null; // Reset cache on error
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
  cachedConnection = null; // Reset cache on disconnect
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

export async function mongoConnect() {
  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }

  // If connection exists but not ready, wait for it
  if (cachedConnection) {
    console.log("Waiting for existing connection attempt...");
    return cachedConnection;
  }

  // Create new connection promise and cache it
  console.log("Creating new MongoDB connection...");
  cachedConnection = mongoose
    .connect(MONGO_URI, {
      maxPoolSize: 10, // Pool of connections for concurrent users
      minPoolSize: 2, // Keep minimum connections alive
      bufferCommands: false, // Don't buffer commands if not connected
      compressors: "zlib",
      maxIdleTimeMS: 600000, // 10 minutes
    })
    .catch((err) => {
      cachedConnection = null; // Reset cache on connection failure
      throw err;
    });

  return cachedConnection;
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
  cachedConnection = null;
  await mongoDisconnect();
  return await initMongoDB();
};
