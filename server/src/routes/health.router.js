import express from "express";
import { httpGetHealthStatus, httpGetCacheStats, httpGetClientIp } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/", httpGetHealthStatus);
router.get("/ip", httpGetClientIp)
router.get("/cache-stats", httpGetCacheStats);

export default router;
