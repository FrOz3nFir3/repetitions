import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
import dotenv from "dotenv";

// Load env first for faster access
dotenv.config({ path: "../.env" });

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
  // Skip if already connected (important for Vercel serverless reuse)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Optimized connection pool for concurrent users
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 10, // Pool of connections for concurrent users
    minPoolSize: 2, // Keep minimum connections alive
    bufferCommands: false, // Don't buffer commands if not connected
    compressors: "zlib",
    maxIdleTimeMS: 600000,
  });
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
