/**
 * Redis Cache Configuration
 * 
 * This configuration defines TTL values, cache key prefixes, and other
 * cache-related settings based on environment variables and defaults.
 */

export const CACHE_CONFIG = {
    // Cache behavior settings
    ENABLED: process.env.REDIS_CACHE_ENABLED !== "false", // Enabled by default

    // Time To Live (TTL) values in seconds - hardcoded for consistency
    TTL: {
        USER: 60 * 60 * 2, // 2 hours
        CARD: 60 * 60 * 6, // 6 hours  
        CATEGORY: 60 * 60 * 6, // 6 hours
        PROGRESS: 60 * 30, // 30 minutes
        REVIEW_QUEUE: 60 * 60 * 2, // 2 hours
        SEARCH: 60 * 30, // 30 minutes
        REPORT: 60 * 60, // 1 hour
        DEFAULT: 60 * 60, // 1 hour
    },

    // Cache key prefixes for namespacing - hardcoded
    PREFIXES: {
        CACHE: "app",
        TAG: "tag",
    },

    // Operation timeouts in milliseconds - hardcoded
    TIMEOUTS: {
        READ: 4000, // 4 seconds
        WRITE: 3000, // 3 seconds
        DELETE: 5000, // 5 seconds
    },

    // Cache key compression settings - hardcoded (disabled by default)
    COMPRESSION: {
        ENABLED: false,
        MIN_SIZE: 1024, // 1KB
    },

    // Cache statistics and monitoring - always enabled
    STATS: {
        ENABLED: true,
        LOG_INTERVAL: 300000, // 5 minutes
    },

    // Debug logging - controlled by single env var
    DEBUG: {
        ENABLED: process.env.CACHE_DEBUG_ENABLED === "true", // Disabled by default
        // When debug is enabled, log everything
        LOG_CACHE_HITS: process.env.CACHE_DEBUG_ENABLED === "true",
        LOG_CACHE_MISSES: process.env.CACHE_DEBUG_ENABLED === "true",
        LOG_INVALIDATIONS: process.env.CACHE_DEBUG_ENABLED === "true",
        LOG_TAG_OPERATIONS: process.env.CACHE_DEBUG_ENABLED === "true",
    },
};

// Cache data types for TTL assignment
export const CACHE_TYPES = {
    USER: "user",
    CARD: "card",
    CATEGORY: "category",
    PROGRESS: "progress",
    REVIEW_QUEUE: "review_queue",
    SEARCH: "search",
    REPORT: "report",
};

// Environment validation
export function validateCacheConfig() {
    const errors = [];

    // Validate TTL values are positive integers
    Object.entries(CACHE_CONFIG.TTL).forEach(([key, value]) => {
        if (!Number.isInteger(value) || value <= 0) {
            errors.push(`Invalid TTL value for ${key}: ${value}`);
        }
    });

    // Validate timeout values are positive integers
    Object.entries(CACHE_CONFIG.TIMEOUTS).forEach(([key, value]) => {
        if (!Number.isInteger(value) || value <= 0) {
            errors.push(`Invalid timeout value for ${key}: ${value}`);
        }
    });

    // Validate prefixes are non-empty strings
    Object.entries(CACHE_CONFIG.PREFIXES).forEach(([key, value]) => {
        if (typeof value !== "string" || value.length === 0) {
            errors.push(`Invalid prefix for ${key}: ${value}`);
        }
    });

    if (errors.length > 0) {
        throw new Error(`Cache configuration validation failed:\n${errors.join("\n")}`);
    }

    return true;
}