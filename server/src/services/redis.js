import Redis from "ioredis";
import dotenv from "dotenv";

// Load env first
dotenv.config({ path: "../.env" });

const MAX_RETRIES = 5;

const redis = new Redis(process.env.REDIS_URI, {
  retryStrategy: (times) => {
    // Log the retry attempt
    console.log(`Redis connection retry attempt: ${times}`);

    if (times > MAX_RETRIES) {
      console.error("Max Redis connection retries reached. Giving up.");
      // To stop retrying, return null or a non-number.
      return null;
    }

    // Return a delay for the next retry (e.g., exponential backoff)
    const delay = Math.min(times * 100, 2000);
    return delay;
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err.message));
redis.on("connect", () => console.log("Initializing Redis connection...")); // Fired when connection is initiated
const startTime = Date.now();
redis.on("ready", () =>
  console.log(`Redis connection ready in ${Date.now() - startTime}ms`)
); // Fired after connection is successful

export { redis };
