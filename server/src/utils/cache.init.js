/**
 * Cache Initialization Utilities
 * 
 * Handles cache system initialization, configuration validation,
 * and setup of cache-related services.
 */

import { validateCacheConfig, CACHE_CONFIG } from "../config/cache.config.js";
import { logCacheError, logCacheOperation, CACHE_ERRORS } from "./cache.errors.js";
import { redis } from "../services/redis.js";

/**
 * Initialize the cache system
 * 
 * @returns {Promise<boolean>} True if initialization successful
 */
export async function initializeCache() {
    try {
        // Validate cache configuration
        validateCacheConfig();

        logCacheOperation("init", null, "success", {
            enabled: CACHE_CONFIG.ENABLED,
            ttlConfig: CACHE_CONFIG.TTL,
            prefixes: CACHE_CONFIG.PREFIXES,
        });

        // Check Redis connection if caching is enabled
        if (CACHE_CONFIG.ENABLED) {
            const isRedisReady = await checkRedisConnection();

            if (!isRedisReady) {
                logCacheError(CACHE_ERRORS.CONNECTION_FAILED, new Error("Redis not ready during cache initialization"), {
                    operation: "init",
                    fallbackMode: true,
                });

                // Continue without caching
                return false;
            }

            logCacheOperation("redis_check", null, "success", {
                message: "Redis connection verified for caching",
            });
        }

        return true;
    } catch (error) {
        logCacheError(CACHE_ERRORS.CONFIGURATION_ERROR, error, {
            operation: "init",
        });

        // Disable caching on initialization failure
        CACHE_CONFIG.ENABLED = false;
        return false;
    }
}

/**
 * Check Redis connection status
 * 
 * @returns {Promise<boolean>} True if Redis is ready
 */
export async function checkRedisConnection() {
    try {
        if (!redis || !redis.isReady) {
            return false;
        }

        // Test Redis with a simple ping
        await redis.ping();
        return true;
    } catch (error) {
        logCacheError(CACHE_ERRORS.CONNECTION_FAILED, error, {
            operation: "connection_check",
        });
        return false;
    }
}

/**
 * Get cache system health status
 * 
 * @returns {Promise<Object>} Health status object
 */
export async function getCacheHealth() {
    const health = {
        enabled: CACHE_CONFIG.ENABLED,
        redisConnected: false,
        configValid: false,
        timestamp: new Date().toISOString(),
    };

    try {
        // Check configuration validity
        validateCacheConfig();
        health.configValid = true;
    } catch (error) {
        health.configError = error.message;
    }

    // Check Redis connection
    if (CACHE_CONFIG.ENABLED) {
        health.redisConnected = await checkRedisConnection();
    }

    return health;
}

/**
 * Gracefully shutdown cache system
 * 
 * @returns {Promise<void>}
 */
export async function shutdownCache() {
    try {
        logCacheOperation("shutdown", null, "success", {
            message: "Cache system shutdown initiated",
        });

        // Note: Redis connection is managed by the redis service
        // We don't close it here as it might be used by other parts of the app

    } catch (error) {
        logCacheError(CACHE_ERRORS.CONNECTION_FAILED, error, {
            operation: "shutdown",
        });
    }
}