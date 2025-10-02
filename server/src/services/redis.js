import { createClient } from "redis";
import dotenv from "dotenv";

// Load env first for faster access
dotenv.config({ path: "../.env" });

let retryCount = 0;
const MAX_RETRIES = 3;

const client = createClient({
  url: process.env.REDIS_URI,
  socket: {
    reconnectStrategy: (options) => {
      // Log the retry attempt
      console.log(`Redis connection retry attempt: ${retryCount + 1}`);

      if (retryCount >= MAX_RETRIES) {
        console.error("Max Redis connection retries reached. Giving up.");
        return new Error("Max Redis connection retries reached.");
      }

      // Increment the retry counter
      retryCount++;

      // Return a delay for the next retry (e.g., exponential backoff)
      // This example uses a simple fixed delay
      return Math.min(options.attempt * 100, 2000);
    },
  },
});

client.on("error", (err) => console.log("Redis Client Error", err.message));

async function redisConnect() {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (e) {
    console.log("Error connecting to Redis", e.message ?? "Unknown error");
  }
}

const redisClient = client;

export { redisClient, redisConnect };
