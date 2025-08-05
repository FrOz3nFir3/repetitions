import app from "./app.js";
import { initMongoDB } from "./services/mongo.js";

const PORT = process.env.PORT || 80;

// Initialize MongoDB for Vercel serverless
initMongoDB();

async function startServer() {
  // For local development, start the HTTP server
  const server = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  return server;
}

// Export for Vercel serverless
export default app;

// Start server for local development only
if (process.env.NODE_ENV !== "production") {
  startServer();
}
