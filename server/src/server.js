import app from "./app.js";
import { mongoConnect } from "./services/mongo.js";
const PORT = process.env.PORT || 80;

async function startServer() {
  // Start HTTP server immediately - don't wait for MongoDB
  const server = app.listen(PORT, () => {
    console.log(`Backend Server listening on http://localhost:${PORT}`);
  });

  // Connect to MongoDB with timeout and retry logic
  let retryCount = 0;
  const maxRetries = 5;

  const connectWithTimeout = async () => {
    const timeout = setTimeout(() => {
      console.warn("MongoDB connection taking longer than expected...");
    }, 10000); // Warn after 10 seconds

    try {
      await mongoConnect();
      clearTimeout(timeout);
      console.log("MongoDB connection established successfully");
      retryCount = 0; // Reset retry count on successful connection
    } catch (err) {
      clearTimeout(timeout);
      retryCount++;
      console.error(
        `MongoDB connection failed (attempt ${retryCount}/${maxRetries}):`,
        err.message
      );

      if (retryCount < maxRetries) {
        console.log(
          `Retrying MongoDB connection in 5 seconds... (${
            maxRetries - retryCount
          } attempts remaining)`
        );
        setTimeout(() => {
          connectWithTimeout();
        }, 5000);
      } else {
        console.error(
          "MongoDB connection failed after maximum retry attempts. Server will continue without database."
        );
        console.error(
          "Please check your MongoDB connection string and network connectivity."
        );
      }
    }
  };

  // Start connection attempt
  connectWithTimeout();

  return server;
}

startServer();
