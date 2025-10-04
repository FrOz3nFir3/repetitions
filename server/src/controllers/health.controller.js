import { getConnectionStatus } from "../services/mongo.js";
import { cacheService } from "../services/cache.js";


export async function httpGetHealthStatus(req, res) {
    const mongoStatus = getConnectionStatus();

    // Check Redis connection status
    await cacheService.checkRedisConnection();
    const redisStatus = cacheService.getConnectionStatus();

    res.json({
        status: "ok",
        mongodb: {
            status: mongoStatus.status,
            isConnected: mongoStatus.isConnected,
        },
        redis: {
            status: redisStatus.isAvailable ? "connected" : "disconnected",
            cachingEnabled: redisStatus.enabled,
        },
        uptime: process.uptime(),
        timestamp: new Date().toLocaleString(),
        environment: process.env.NODE_ENV || "development",
    });
}


export function httpGetCacheStats(req, res) {
    const stats = cacheService.getStatistics();
    const connectionStatus = cacheService.getConnectionStatus();

    res.json({
        cachingEnabled: connectionStatus.enabled,
        available: connectionStatus.isAvailable,
        statistics: stats,
    });
}
