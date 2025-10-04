import express from "express";
import { httpGetHealthStatus, httpGetCacheStats } from "../controllers/health.controller.js";

const router = express.Router();

router.get("/", httpGetHealthStatus);
router.get("/cache-stats", httpGetCacheStats);

export default router;
