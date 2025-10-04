/**
 * Cache Utilities
 * 
 * Provides utility functions for cache key generation, parameter hashing,
 * and other cache-related operations following proper naming conventions.
 */

import crypto from "crypto";
import { CACHE_CONFIG, CACHE_TYPES } from "../config/cache.config.js";

/**
 * Generate a standardized cache key following the pattern:
 * {prefix}:{type}:{identifier}:{params_hash}
 * 
 * @param {string} type - Cache type (user, card, category, etc.)
 * @param {string} identifier - Unique identifier (user ID, card ID, etc.)
 * @param {Object} params - Additional parameters to include in key
 * @returns {string} Generated cache key
 */
export function generateCacheKey(type, identifier, params = {}) {
    const prefix = CACHE_CONFIG.PREFIXES.CACHE;

    // Validate inputs
    if (!type || typeof type !== "string") {
        throw new Error("Cache key type must be a non-empty string");
    }

    if (!identifier || typeof identifier !== "string") {
        throw new Error("Cache key identifier must be a non-empty string");
    }

    // Build base key
    let key = `${prefix}:${type}:${identifier}`;

    // Add parameters hash if provided
    if (params && Object.keys(params).length > 0) {
        const paramsHash = hashParams(params);
        key += `:${paramsHash}`;
    }

    return key;
}

/**
 * Generate a cache key for list/collection endpoints
 * 
 * @param {string} type - Cache type
 * @param {Object} params - Query parameters (page, limit, filters, etc.)
 * @returns {string} Generated cache key for list
 */
export function generateListCacheKey(type, params = {}) {
    const prefix = CACHE_CONFIG.PREFIXES.CACHE;
    const paramsHash = hashParams(params);

    return `${prefix}:${type}:list:${paramsHash}`;
}

/**
 * Generate a tag name for cache invalidation
 * 
 * @param {string} tagType - Type of tag (Card, User, Report, etc.)
 * @param {string} identifier - Optional identifier for specific tags
 * @returns {string} Generated tag name
 */
export function generateTagName(tagType, identifier = null) {
    if (identifier) {
        return `${tagType}:${identifier}`;
    }
    return tagType;
}

/**
 * Generate a Redis key for storing tag-to-keys mapping
 * 
 * @param {string} tagName - Tag name
 * @returns {string} Redis key for tag storage
 */
export function generateTagKey(tagName) {
    const prefix = CACHE_CONFIG.PREFIXES.TAG;
    return `${prefix}:${tagName}`;
}

/**
 * Hash parameters object to create a consistent string representation
 * 
 * @param {Object} params - Parameters to hash
 * @returns {string} MD5 hash of sorted parameters
 */
export function hashParams(params) {
    if (!params || typeof params !== "object" || Object.keys(params).length === 0) {
        return "empty";
    }

    // Sort keys to ensure consistent hashing
    const sortedKeys = Object.keys(params).sort();
    const sortedParams = {};

    sortedKeys.forEach(key => {
        sortedParams[key] = params[key];
    });

    // Create hash from JSON string
    const paramString = JSON.stringify(sortedParams);
    return crypto.createHash("md5").update(paramString).digest("hex").substring(0, 8);
}

/**
 * Get TTL value for a specific cache type
 * 
 * @param {string} type - Cache type
 * @returns {number} TTL in seconds
 */
export function getTTLForType(type) {
    const upperType = type.toUpperCase();
    return CACHE_CONFIG.TTL[upperType] || CACHE_CONFIG.TTL.DEFAULT;
}

/**
 * Extract cache type from request path and method
 * 
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @returns {string} Determined cache type
 */
export function extractCacheTypeFromPath(path, method = "GET") {
    // Only cache GET requests
    if (method !== "GET") {
        return null;
    }

    // Path-based type detection
    if (path.includes("/user")) {
        if (path.includes("/progress") || path.includes("/stats") || path.includes("/report")) {
            return CACHE_TYPES.PROGRESS;
        }
        return CACHE_TYPES.USER;
    }

    if (path.includes("/card")) {
        if (path.includes("/review-queue")) {
            return CACHE_TYPES.REVIEW_QUEUE;
        }
        return CACHE_TYPES.CARD;
    }

    if (path.includes("/cards")) {
        return CACHE_TYPES.CARD;
    }

    if (path.includes("/category") || path.includes("/categories")) {
        return CACHE_TYPES.CATEGORY;
    }

    if (path.includes("/search")) {
        return CACHE_TYPES.SEARCH;
    }

    // Default type
    return CACHE_TYPES.USER;
}

/**
 * Sanitize cache key to ensure Redis compatibility
 * 
 * @param {string} key - Raw cache key
 * @returns {string} Sanitized cache key
 */
export function sanitizeCacheKey(key) {
    // Remove or replace characters that might cause issues in Redis
    return key
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w:.-]/g, "") // Remove special characters except : . - _
        .toLowerCase();
}

/**
 * Parse cache key to extract components
 * 
 * @param {string} key - Cache key to parse
 * @returns {Object} Parsed key components
 */
export function parseCacheKey(key) {
    const parts = key.split(":");

    if (parts.length < 3) {
        throw new Error(`Invalid cache key format: ${key}`);
    }

    return {
        prefix: parts[0],
        type: parts[1],
        identifier: parts[2],
        paramsHash: parts[3] || null,
        fullKey: key,
    };
}

/**
 * Check if caching is enabled for the current environment
 * 
 * @returns {boolean} True if caching is enabled
 */
export function isCacheEnabled() {
    return CACHE_CONFIG.ENABLED;
}

/**
 * Generate cache statistics key
 * 
 * @param {string} operation - Cache operation (hit, miss, set, delete)
 * @returns {string} Statistics key
 */
export function generateStatsKey(operation) {
    return `${CACHE_CONFIG.PREFIXES.CACHE}:stats:${operation}`;
}