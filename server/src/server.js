import app from "./app.js";
import { initMongoDB } from "./services/mongo.js";
import { redisConnect } from "./services/redis.js";

const PORT = process.env.PORT || 80;

async function startServer() {
  const localStartTime = Date.now();

  try {
    // Initialize MongoDB first (blocking)
    await initMongoDB();
    await redisConnect();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
      console.log(
        `Backend Server with PID:${process.pid} started in ${
          Date.now() - localStartTime
        }ms`
      );
    });
  } catch (err) {
    console.error(`Server startup failed:`, err.message);
    process.exit(1); // Exit if worker fails to start
  }
}

startServer();
