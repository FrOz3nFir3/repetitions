import cluster from "node:cluster";
import os from "node:os";
import app from "./app.js";
import { initMongoDB } from "./services/mongo.js";
// automatically connects, later have proper valdiation to make sure redis is working
import { redis } from "./services/redis.js";

const PORT = process.env.PORT || 80;
const enableCluster = process.env.ENABLE_CLUSTER ?? false;

async function startServer() {
  const localStartTime = Date.now();

  try {
    // Initialize MongoDB first (blocking)
    await initMongoDB();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(
        `Worker ${process.pid} listening on http://localhost:${PORT}`
      );
      console.log(
        `Worker ${process.pid} started in ${Date.now() - localStartTime}ms`
      );
    });
  } catch (err) {
    console.error(`Worker ${process.pid} startup failed:`, err.message);
    process.exit(1); // Exit if worker fails to start
  }
}

function setupPrimary() {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking for ${numCPUs} CPUs`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    console.log("Starting a new worker");
    cluster.fork(); // Restart a new worker when one dies
  });
}

if (cluster.isPrimary && enableCluster) {
  setupPrimary();
} else {
  startServer();
}
