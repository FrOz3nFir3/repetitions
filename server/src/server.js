import app from "./app.js";
import { initMongoDB } from "./services/mongo.js";

const PORT = process.env.PORT || 80;

async function startServer() {
  // Initialize MongoDB first (blocking)
  await initMongoDB();

  // For local development, start the HTTP server
  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  return server;
}

startServer();
