import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
// used to solve the mongodb connection issue with DNS
setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

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
  // Optimized connection options for faster startup
  await mongoose.connect(MONGO_URI, {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
