import express from "express";
import { getConnectionStatus } from "../services/mongo.js";

const router = express.Router();

router.get("/", (req, res) => {
  const connectionInfo = getConnectionStatus();

  res.json({
    status: "ok",
    mongodb: connectionInfo.status,
    isConnected: connectionInfo.isConnected,
  });
});

export default router;
