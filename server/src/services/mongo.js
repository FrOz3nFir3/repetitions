const mongoose = require("mongoose");
const dns = require("node:dns/promises");
// used to solve the mongodb connection issue with DNS
dns.setServers(["1.1.1.1"]);

require("dotenv").config({ path: "../.env" });

// Update below to match your own MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URI);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
