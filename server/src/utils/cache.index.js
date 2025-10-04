/**
 * Cache System Exports
 * 
 * Central export file for all cache-related utilities, configurations,
 * and error handling functions.
 */

// Configuration
export {
    CACHE_CONFIG,
    CACHE_TYPES,
    validateCacheConfig
} from "../config/cache.config.js";

// Utilities
export {
    generateCacheKey,
    generateListCacheKey,
    generateTagName,
    generateTagKey,
    hashParams,
    getTTLForType,
    extractCacheTypeFromPath,
    sanitizeCacheKey,
    parseCacheKey,
    isCacheEnabled,
    generateStatsKey,
} from "./cache.utils.js";

// Error handling
export {
    CACHE_ERRORS,
    CACHE_OPERATIONS,
    ERROR_SEVERITY,
    logCacheOperation,
    logCacheError,
    logCacheStats,
    getErrorSeverity,
    createCacheError,
    sanitizeKeyForLogging,
    withCacheErrorHandling,
    determineErrorType,
    shouldFallback,
} from "./cache.errors.js";

// Initialization
export {
    initializeCache,
    checkRedisConnection,
    getCacheHealth,
    shutdownCache,
} from "./cache.init.js";