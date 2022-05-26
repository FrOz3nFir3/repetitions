const app = require("./app");
const { mongoConnect } = require("./services/mongo");
const PORT = process.env.PORT || 3000;

async function startServer() {
  await mongoConnect();
  app.listen(PORT, () => {
    console.log(`Backend Server listening on http://localhost:${PORT}`);
  });
}

startServer();
