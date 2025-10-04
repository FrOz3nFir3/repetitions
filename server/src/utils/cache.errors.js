/**
 * Cache Error Handling Constants and Utilities
 * 
 * Defines error types, logging utilities, and error handling patterns
 * for Redis cache operations with graceful degradation.
 */

/**
 * Cache error categories for monitoring and logging
 */
export const CACHE_ERRORS = {
    CONNECTION_FAILED: "redis_connection_failed",
    READ_TIMEOUT: "cache_read_timeout",
    WRITE_FAILED: "cache_write_failed",
    DELETE_FAILED: "cache_delete_failed",
    INVALIDATION_FAILED: "cache_invalidation_failed",
    SERIALIZATION_ERROR: "cache_serialization_error",
    DESERIALIZATION_ERROR: "cache_deserialization_error",
    KEY_GENERATION_ERROR: "cache_key_generation_error",
    TAG_OPERATION_ERROR: "cache_tag_operation_error",
    BATCH_OPERATION_ERROR: "cache_batch_operation_error",
    TIMEOUT_ERROR: "cache_timeout_error",
    REDIS_NOT_READY: "redis_not_ready",
    CONFIGURATION_ERROR: "cache_configuration_error",
};

/**
 * Cache operation types for logging
 */
export const CACHE_OPERATIONS = {
    GET: "get",
    SET: "set",
    DELETE: "delete",
    EXISTS: "exists",
    MGET: "mget",
    MSET: "mset",
    MDEL: "mdel",
    INVALIDATE_TAGS: "invalidate_tags",
    ADD_TAGS: "add_tags",
    REMOVE_TAGS: "remove_tags",
    GET_BY_TAG: "get_by_tag",
};

/**
 * Cache error severity levels
 */
export const ERROR_SEVERITY = {
    LOW: "low",        // Cache miss, fallback to database
    MEDIUM: "medium",  // Cache write failure, operation continues
    HIGH: "high",      // Connection failure, Redis unavailable
    CRITICAL: "critical", // Configuration error, system issue
};

/**
 * Log cache operation with structured format
 * 
 * @param {string} operation - Cache operation type
 * @param {string} key - Cache key involved
 * @param {string} status - Operation status (success, error, timeout)
 * @param {Object} metadata - Additional metadata
 */
export function logCacheOperation(operation, key, status, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type: "cache_operation",
        operation,
        key: key ? sanitizeKeyForLogging(key) : null,
        status,
        ...metadata,
    };

    if (status === "success") {
        console.log(`[CACHE] ${operation.toUpperCase()} ${status}:`, JSON.stringify(logEntry));
    } else {
        console.error(`[CACHE] ${operation.toUpperCase()} ${status}:`, JSON.stringify(logEntry));
    }
}

/**
 * Log cache error with detailed information
 * 
 * @param {string} errorType - Error type from CACHE_ERRORS
 * @param {Error} error - Original error object
 * @param {Object} context - Additional context information
 */
export function logCacheError(errorType, error, context = {}) {
    const timestamp = new Date().toISOString();
    const severity = getErrorSeverity(errorType);

    const logEntry = {
        timestamp,
        type: "cache_error",
        errorType,
        severity,
        message: error?.message || "Unknown error",
        stack: error?.stack || null,
        ...context,
    };

    // Log based on severity
    if (severity === ERROR_SEVERITY.CRITICAL || severity === ERROR_SEVERITY.HIGH) {
        console.error(`[CACHE ERROR] ${errorType}:`, JSON.stringify(logEntry));
    } else {
        console.warn(`[CACHE WARNING] ${errorType}:`, JSON.stringify(logEntry));
    }
}

/**
 * Log cache statistics periodically
 * 
 * @param {Object} stats - Cache statistics object
 */
export function logCacheStats(stats) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type: "cache_stats",
        ...stats,
    };

    console.log(`[CACHE STATS]`, JSON.stringify(logEntry));
}

/**
 * Get error severity level for a specific error type
 * 
 * @param {string} errorType - Error type from CACHE_ERRORS
 * @returns {string} Severity level
 */
export function getErrorSeverity(errorType) {
    const severityMap = {
        [CACHE_ERRORS.CONNECTION_FAILED]: ERROR_SEVERITY.HIGH,
        [CACHE_ERRORS.READ_TIMEOUT]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.WRITE_FAILED]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.DELETE_FAILED]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.INVALIDATION_FAILED]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.SERIALIZATION_ERROR]: ERROR_SEVERITY.LOW,
        [CACHE_ERRORS.DESERIALIZATION_ERROR]: ERROR_SEVERITY.LOW,
        [CACHE_ERRORS.KEY_GENERATION_ERROR]: ERROR_SEVERITY.HIGH,
        [CACHE_ERRORS.TAG_OPERATION_ERROR]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.BATCH_OPERATION_ERROR]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.TIMEOUT_ERROR]: ERROR_SEVERITY.MEDIUM,
        [CACHE_ERRORS.REDIS_NOT_READY]: ERROR_SEVERITY.HIGH,
        [CACHE_ERRORS.CONFIGURATION_ERROR]: ERROR_SEVERITY.CRITICAL,
    };

    return severityMap[errorType] || ERROR_SEVERITY.MEDIUM;
}

/**
 * Create a standardized cache error object
 * 
 * @param {string} errorType - Error type from CACHE_ERRORS
 * @param {string} message - Error message
 * @param {Object} context - Additional context
 * @returns {Error} Standardized error object
 */
export function createCacheError(errorType, message, context = {}) {
    const error = new Error(message);
    error.type = errorType;
    error.severity = getErrorSeverity(errorType);
    error.context = context;
    error.timestamp = new Date().toISOString();

    return error;
}

/**
 * Sanitize cache key for logging (remove sensitive information)
 * 
 * @param {string} key - Cache key to sanitize
 * @returns {string} Sanitized key for logging
 */
export function sanitizeKeyForLogging(key) {
    // Replace potential user IDs or sensitive data with placeholders
    return key
        .replace(/:[a-f0-9]{24}:/g, ":[USER_ID]:") // MongoDB ObjectIds
        .replace(/:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}:/g, ":[UUID]:") // UUIDs
        .replace(/:[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}:/g, ":[EMAIL]:"); // Email addresses
}

/**
 * Wrap cache operation with error handling and logging
 * 
 * @param {Function} operation - Cache operation function
 * @param {string} operationType - Operation type for logging
 * @param {string} key - Cache key involved
 * @param {Object} options - Additional options
 * @returns {Promise} Wrapped operation result
 */
export async function withCacheErrorHandling(operation, operationType, key, options = {}) {
    const startTime = Date.now();

    try {
        const result = await operation();

        const duration = Date.now() - startTime;
        logCacheOperation(operationType, key, "success", {
            duration,
            ...options.metadata
        });

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        const errorType = determineErrorType(error, operationType);

        logCacheError(errorType, error, {
            operation: operationType,
            key: sanitizeKeyForLogging(key),
            duration,
            ...options.context,
        });

        // Re-throw error if it should not be handled gracefully
        if (options.throwOnError) {
            throw error;
        }

        // Return fallback value for graceful degradation
        return options.fallbackValue || null;
    }
}

/**
 * Determine error type based on error object and operation
 * 
 * @param {Error} error - Error object
 * @param {string} operation - Cache operation type
 * @returns {string} Determined error type
 */
export function determineErrorType(error, operation) {
    const message = error?.message?.toLowerCase() || "";

    if (message.includes("timeout")) {
        return CACHE_ERRORS.TIMEOUT_ERROR;
    }

    if (message.includes("connection") || message.includes("connect")) {
        return CACHE_ERRORS.CONNECTION_FAILED;
    }

    if (message.includes("serializ")) {
        return CACHE_ERRORS.SERIALIZATION_ERROR;
    }

    if (message.includes("deserializ")) {
        return CACHE_ERRORS.DESERIALIZATION_ERROR;
    }

    // Operation-specific error mapping
    const operationErrorMap = {
        [CACHE_OPERATIONS.GET]: CACHE_ERRORS.READ_TIMEOUT,
        [CACHE_OPERATIONS.SET]: CACHE_ERRORS.WRITE_FAILED,
        [CACHE_OPERATIONS.DELETE]: CACHE_ERRORS.DELETE_FAILED,
        [CACHE_OPERATIONS.MGET]: CACHE_ERRORS.READ_TIMEOUT,
        [CACHE_OPERATIONS.MSET]: CACHE_ERRORS.WRITE_FAILED,
        [CACHE_OPERATIONS.MDEL]: CACHE_ERRORS.DELETE_FAILED,
        [CACHE_OPERATIONS.INVALIDATE_TAGS]: CACHE_ERRORS.INVALIDATION_FAILED,
        [CACHE_OPERATIONS.ADD_TAGS]: CACHE_ERRORS.TAG_OPERATION_ERROR,
        [CACHE_OPERATIONS.REMOVE_TAGS]: CACHE_ERRORS.TAG_OPERATION_ERROR,
        [CACHE_OPERATIONS.GET_BY_TAG]: CACHE_ERRORS.TAG_OPERATION_ERROR,
    };

    return operationErrorMap[operation] || CACHE_ERRORS.WRITE_FAILED;
}

/**
 * Check if error should trigger fallback behavior
 * 
 * @param {string} errorType - Error type
 * @returns {boolean} True if should fallback
 */
export function shouldFallback(errorType) {
    const fallbackErrors = [
        CACHE_ERRORS.CONNECTION_FAILED,
        CACHE_ERRORS.READ_TIMEOUT,
        CACHE_ERRORS.TIMEOUT_ERROR,
        CACHE_ERRORS.REDIS_NOT_READY,
    ];

    return fallbackErrors.includes(errorType);
}