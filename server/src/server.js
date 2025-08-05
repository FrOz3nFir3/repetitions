import app from "./app.js";
import { initMongoDB } from "./services/mongo.js";

const PORT = process.env.PORT || 80;

async function startServer() {
  const localStartTime = Date.now();

  try {
    // Initialize MongoDB first (blocking)
    await initMongoDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log(`Server Started in ${Date.now() - localStartTime}ms`);
    });

    return server;
  } catch (err) {
    console.error(`Server startup failed:`, err.message);
    throw err;
  }
}

startServer();
