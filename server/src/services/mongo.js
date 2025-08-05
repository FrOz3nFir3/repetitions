import mongoose from "mongoose";
import { setServers } from "node:dns/promises";
// used to solve the mongodb connection issue with DNS
setServers(["1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Update below to match your own MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

export async function mongoConnect() {
  await mongoose.connect(MONGO_URI);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
