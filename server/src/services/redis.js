import { createClient } from "redis";
import dotenv from "dotenv";

// Load env first for faster access
dotenv.config({ path: "../.env" });

const MAX_RETRIES = 5;

const client = createClient({
  url: process.env.REDIS_URI,
  socket: {
    reconnectStrategy: (retryCount) => {
      // Log the retry attempt
      console.log(`Redis connection retry attempt: ${retryCount + 1}`);

      if (retryCount >= MAX_RETRIES - 1) {
        console.error("Max Redis connection retries reached. Giving up.");
        return new Error("Max Redis connection retries reached.");
      }

      // Return a delay for the next retry (e.g., exponential backoff)
      // This example uses a simple fixed delay
      return 2000;
    },
  },
});

client.on("error", (err) => console.log("Redis Client Error", err.message));

const startTime = Date.now();
async function redisConnect() {
  try {
    await client.connect();
    console.log(`Redis connection ready in ${Date.now() - startTime}ms`);
  } catch (e) {
    console.log("Error connecting to Redis", e.message ?? "Unknown error");
  }
}

const redis = client;

export { redis, redisConnect };
