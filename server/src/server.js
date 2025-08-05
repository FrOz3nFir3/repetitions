import app from "./app.js";
import { mongoConnect } from "./services/mongo.js";
const PORT = process.env.PORT || 80;

async function startServer() {
  await mongoConnect();
  app.listen(PORT, () => {
    console.log(`Backend Server listening on http://localhost:${PORT}`);
  });
}

startServer();
