/**
 * Redis Cache Service
 *
 * Provides a comprehensive caching layer with CRUD operations, tag-based management,
 * and robust error handling. Implements graceful degradation when Redis is unavailable.
 */

import { redis } from "./redis.js";
import { CACHE_CONFIG, CACHE_TYPES } from "../config/cache.config.js";
import crypto from "crypto";
import zlib from "zlib";
import { promisify } from "util";

// Promisify zlib functions for async/await
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * Cache error categories for monitoring and debugging
 */
const CACHE_ERRORS = {
  CONNECTION_FAILED: "redis_connection_failed",
  READ_TIMEOUT: "cache_read_timeout",
  WRITE_TIMEOUT: "cache_write_timeout",
  DELETE_TIMEOUT: "cache_delete_timeout",
  WRITE_FAILED: "cache_write_failed",
  READ_FAILED: "cache_read_failed",
  DELETE_FAILED: "cache_delete_failed",
  INVALIDATION_FAILED: "cache_invalidation_failed",
  SERIALIZATION_ERROR: "cache_serialization_error",
  TAG_OPERATION_FAILED: "cache_tag_operation_failed",
};

/**
 * Cache Service Class
 *
 * Handles all Redis caching operations with proper error handling,
 * fallback mechanisms, and tag-based cache management.
 */
class CacheService {
  constructor() {
    this.isRedisAvailable = false;
    this.lastConnectionCheck = null;
    this.connectionErrors = 0;
    this.lastError = null;

    // Cache statistics tracking
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      compressionSaved: 0, // Bytes saved through compression
      lastReset: new Date(),
    };

    this.checkRedisConnection();

    // Set up periodic statistics logging
    if (CACHE_CONFIG.STATS.ENABLED) {
      setInterval(() => {
        this.logStatistics();
      }, CACHE_CONFIG.STATS.LOG_INTERVAL);
    }
  }

  /**
   * Check Redis connection status
   * @returns {Promise<boolean>} Connection status
   */
  async checkRedisConnection() {
    this.lastConnectionCheck = new Date();

    try {
      if (!CACHE_CONFIG.ENABLED) {
        this.isRedisAvailable = false;
        this.lastError = "Caching disabled in configuration";
        return false;
      }

      await redis.ping();

      // Connection successful - reset error tracking
      if (!this.isRedisAvailable) {
        console.log("Redis connection restored");
      }
      this.isRedisAvailable = true;
      this.connectionErrors = 0;
      this.lastError = null;

      return true;
    } catch (error) {
      this.isRedisAvailable = false;
      this.connectionErrors++;
      this.lastError = error.message;

      console.log(
        `Redis connection check failed (attempt ${this.connectionErrors}):`,
        error.message
      );

      return false;
    }
  }

  /**
   * Get detailed connection status for monitoring
   * @returns {Object} Connection status details
   */
  getConnectionStatus() {
    return {
      isAvailable: this.isRedisAvailable,
      enabled: CACHE_CONFIG.ENABLED,
      lastCheck: this.lastConnectionCheck,
      connectionErrors: this.connectionErrors,
      lastError: this.lastError,
    };
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStatistics() {
    const uptime = Date.now() - this.stats.lastReset.getTime();
    const totalOperations = this.stats.hits + this.stats.misses;
    const hitRate =
      totalOperations > 0
        ? ((this.stats.hits / totalOperations) * 100).toFixed(2)
        : 0;

    return {
      ...this.stats,
      compressionSaved: `${(
        this.stats.compressionSaved /
        (1024 * 1024)
      ).toFixed(2)} MB`,
      uptime: Math.floor(uptime / 1000), // seconds
      hitRate: `${hitRate}%`,
      totalOperations,
    };
  }
  /**
   * Log cache statistics to console
   */
  logStatistics() {
    if (!CACHE_CONFIG.STATS.ENABLED) {
      return;
    }

    const stats = this.getStatistics();
    console.log("[CACHE STATS]", {
      hitRate: stats.hitRate,
      hits: stats.hits,
      misses: stats.misses,
      sets: stats.sets,
      deletes: stats.deletes,
      errors: stats.errors,
      compressionSaved: stats.compressionSaved,
      uptime: `${stats.uptime}s`,
    });
  }

  /**
   * Reset cache statistics
   */
  resetStatistics() {
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
      errors: 0,
      compressionSaved: 0,
      lastReset: new Date(),
    };
  }

  /**
   * Compress data if it exceeds minimum size threshold
   * @param {string} data - Data to compress
   * @returns {Promise<{data: Buffer|string, compressed: boolean}>}
   */
  async compressData(data) {
    if (!CACHE_CONFIG.COMPRESSION.ENABLED) {
      return { data, compressed: false };
    }

    const dataSize = Buffer.byteLength(data, "utf8");

    // Only compress if data exceeds minimum size
    if (dataSize < CACHE_CONFIG.COMPRESSION.MIN_SIZE) {
      return { data, compressed: false };
    }

    try {
      const compressed = await gzip(data);
      const compressedSize = compressed.length;

      // Track compression savings
      const saved = dataSize - compressedSize;
      this.stats.compressionSaved += saved;

      return {
        data: compressed.toString("base64"),
        compressed: true,
        originalSize: dataSize,
        compressedSize,
      };
    } catch (error) {
      this.logError(CACHE_ERRORS.SERIALIZATION_ERROR, "compressData", error, {
        dataSize,
      });
      return { data, compressed: false };
    }
  }

  /**
   * Decompress data if it was compressed
   * @param {string} data - Data to decompress
   * @param {boolean} isCompressed - Whether data is compressed
   * @returns {Promise<string>}
   */
  async decompressData(data, isCompressed) {
    if (!isCompressed) {
      return data;
    }

    try {
      const buffer = Buffer.from(data, "base64");
      const decompressed = await gunzip(buffer);
      return decompressed.toString("utf8");
    } catch (error) {
      this.logError(CACHE_ERRORS.SERIALIZATION_ERROR, "decompressData", error);
      throw error; // Re-throw to trigger cache miss
    }
  }

  /**
   * Log cache operation errors with categorization
   * @param {string} errorType - Error category from CACHE_ERRORS
   * @param {string} operation - Operation being performed
   * @param {Error} error - Error object
   * @param {Object} context - Additional context (key, tags, etc.)
   */
  logError(errorType, operation, error, context = {}) {
    const errorMessage = {
      type: errorType,
      operation,
      message: error.message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.log(`[CACHE ERROR] ${errorType}:`, JSON.stringify(errorMessage));
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @param {string[]} tags - Optional tags for tracking
   * @returns {Promise<any|null>} Cached value or null if not found/error
   */
  async get(key, tags = []) {
    if (!this.isRedisAvailable) {
      return null;
    }

    try {
      const value = await Promise.race([
        redis.get(key),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Cache read timeout")),
            CACHE_CONFIG.TIMEOUTS.READ
          )
        ),
      ]);

      if (value === null) {
        this.stats.misses++;
        if (CACHE_CONFIG.DEBUG.ENABLED && CACHE_CONFIG.DEBUG.LOG_CACHE_MISSES) {
          console.log(`[CACHE MISS] ${key}`);
        }
        return null;
      }

      // Parse JSON value
      try {
        let parsedValue = JSON.parse(value);

        // Check if data is compressed
        if (parsedValue.__compressed) {
          const decompressed = await this.decompressData(
            parsedValue.data,
            true
          );
          parsedValue = JSON.parse(decompressed);
        }

        // Track cache hit
        this.stats.hits++;
        if (CACHE_CONFIG.DEBUG.ENABLED && CACHE_CONFIG.DEBUG.LOG_CACHE_HITS) {
          console.log(`[CACHE HIT] ${key}`);
        }

        return parsedValue;
      } catch (parseError) {
        this.logError(CACHE_ERRORS.SERIALIZATION_ERROR, "get", parseError, {
          key,
        });
        this.stats.errors++;
        return null;
      }
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.READ_TIMEOUT
        : CACHE_ERRORS.READ_FAILED;
      this.logError(errorType, "get", error, { key });
      this.stats.errors++;
      return null; // Graceful degradation - fallback to database
    }
  }

  /**
   * Set value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   * @param {string[]} tags - Tags for invalidation
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl, tags = []) {
    if (!this.isRedisAvailable) {
      return false;
    }

    try {
      // Serialize value
      let serializedValue;
      try {
        serializedValue = JSON.stringify(value);
      } catch (serializeError) {
        this.logError(CACHE_ERRORS.SERIALIZATION_ERROR, "set", serializeError, {
          key,
        });
        this.stats.errors++;
        return false;
      }

      // Compress if enabled and data is large enough
      const compressionResult = await this.compressData(serializedValue);

      // Wrap compressed data with metadata
      let finalValue;
      if (compressionResult.compressed) {
        finalValue = JSON.stringify({
          __compressed: true,
          data: compressionResult.data,
        });
      } else {
        finalValue = serializedValue;
      }

      // Set cache with TTL using Promise.race for timeout
      await Promise.race([
        redis.setEx(key, ttl, finalValue),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Cache write timeout")),
            CACHE_CONFIG.TIMEOUTS.WRITE
          )
        ),
      ]);

      // Add tags if provided
      if (tags.length > 0) {
        await this.addTagsToKey(key, tags);
      }

      // Track cache set
      this.stats.sets++;

      if (CACHE_CONFIG.DEBUG.ENABLED) {
        const sizeKB = (Buffer.byteLength(finalValue, "utf8") / 1024).toFixed(
          2
        );
        console.log(
          `[CACHE SET] ${key} (${sizeKB}KB, TTL: ${ttl}s${
            tags.length > 0 ? `, tags: ${tags.length}` : ""
          })`
        );
      }

      return true;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.WRITE_TIMEOUT
        : CACHE_ERRORS.WRITE_FAILED;
      this.logError(errorType, "set", error, { key, ttl, tags });
      this.stats.errors++;
      return false; // Graceful degradation - continue without caching
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key to delete
   * @returns {Promise<boolean>} Success status
   */
  async del(key) {
    if (!this.isRedisAvailable) {
      return false;
    }

    try {
      // Remove from cache with timeout
      const result = await Promise.race([
        redis.del(key),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Cache delete timeout")),
            CACHE_CONFIG.TIMEOUTS.DELETE
          )
        ),
      ]);

      // Remove key from all tag sets
      await this.removeKeyFromAllTags(key);

      // Track cache delete
      if (result > 0) {
        this.stats.deletes++;
      }

      return result > 0;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.DELETE_TIMEOUT
        : CACHE_ERRORS.DELETE_FAILED;
      this.logError(errorType, "del", error, { key });
      this.stats.errors++;
      return false; // Graceful degradation - continue processing
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key to check
   * @returns {Promise<boolean>} Existence status
   */
  async exists(key) {
    if (!this.isRedisAvailable) {
      return false;
    }

    try {
      const result = await Promise.race([
        redis.exists(key),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Cache exists timeout")),
            CACHE_CONFIG.TIMEOUTS.READ
          )
        ),
      ]);

      return result === 1;
    } catch (error) {
      console.log(`Cache exists check error for key ${key}:`, error.message);
      return false; // Graceful degradation
    }
  }

  /**
   * Generate cache key with proper naming convention
   * @param {string} type - Cache type (user, card, etc.)
   * @param {string} identifier - Unique identifier
   * @param {Object} params - Additional parameters for key generation
   * @returns {string} Generated cache key
   */
  generateCacheKey(type, identifier, params = {}) {
    const prefix = CACHE_CONFIG.PREFIXES.CACHE;
    let key = `${prefix}:${type}:${identifier}`;

    // Add parameters hash if provided
    if (Object.keys(params).length > 0) {
      const paramsHash = this.hashParams(params);
      key += `:${paramsHash}`;
    }

    return key;
  }

  /**
   * Hash parameters for consistent key generation
   * @param {Object} params - Parameters to hash
   * @returns {string} Hash string
   */
  hashParams(params) {
    // Sort keys for consistent hashing
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});

    const paramString = JSON.stringify(sortedParams);
    return crypto
      .createHash("md5")
      .update(paramString)
      .digest("hex")
      .substring(0, 8);
  }

  /**
   * Get TTL for cache type
   * @param {string} type - Cache type
   * @returns {number} TTL in seconds
   */
  getTTLForType(type) {
    const upperType = type.toUpperCase();
    return CACHE_CONFIG.TTL[upperType] || CACHE_CONFIG.TTL.DEFAULT;
  }

  /**
   * Add tags to a cache key
   * @param {string} key - Cache key
   * @param {string[]} tags - Tags to associate with the key
   * @returns {Promise<boolean>} Success status
   */
  async addTagsToKey(key, tags) {
    if (!this.isRedisAvailable || tags.length === 0) {
      return false;
    }

    try {
      const pipeline = redis.multi();

      // Add key to each tag set
      tags.forEach((tag) => {
        const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
        pipeline.sAdd(tagKey, key);
        // Set TTL for tag set to prevent orphaned tags
        pipeline.expire(
          tagKey,
          Math.max(...Object.values(CACHE_CONFIG.TTL)) + 3600
        ); // Max TTL + 1 hour buffer
      });

      await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Tag operation timeout")),
            CACHE_CONFIG.TIMEOUTS.WRITE
          )
        ),
      ]);

      return true;
    } catch (error) {
      this.logError(CACHE_ERRORS.TAG_OPERATION_FAILED, "addTagsToKey", error, {
        key,
        tags,
      });
      return false;
    }
  }

  /**
   * Remove tags from a cache key
   * @param {string} key - Cache key
   * @param {string[]} tags - Tags to remove from the key
   * @returns {Promise<boolean>} Success status
   */
  async removeTagsFromKey(key, tags) {
    if (!this.isRedisAvailable || tags.length === 0) {
      return false;
    }

    try {
      const pipeline = redis.multi();

      // Remove key from each tag set
      tags.forEach((tag) => {
        const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
        pipeline.sRem(tagKey, key);
      });

      await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Tag operation timeout")),
            CACHE_CONFIG.TIMEOUTS.WRITE
          )
        ),
      ]);

      return true;
    } catch (error) {
      this.logError(
        CACHE_ERRORS.TAG_OPERATION_FAILED,
        "removeTagsFromKey",
        error,
        { key, tags }
      );
      return false;
    }
  }

  /**
   * Get all cache keys associated with a tag
   * @param {string} tag - Tag to search for
   * @returns {Promise<string[]>} Array of cache keys
   */
  async getKeysByTag(tag) {
    if (!this.isRedisAvailable) {
      return [];
    }

    try {
      const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;

      const keys = await Promise.race([
        redis.sMembers(tagKey),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Tag lookup timeout")),
            CACHE_CONFIG.TIMEOUTS.READ
          )
        ),
      ]);

      return keys || [];
    } catch (error) {
      this.logError(CACHE_ERRORS.TAG_OPERATION_FAILED, "getKeysByTag", error, {
        tag,
      });
      return [];
    }
  }

  /**
   * Get all tags associated with a cache key
   * @param {string} key - Cache key to search for
   * @returns {Promise<string[]>} Array of tags
   */
  async getTagsForKey(key) {
    if (!this.isRedisAvailable) {
      return [];
    }

    try {
      // Get all tag keys
      const tagPattern = `${CACHE_CONFIG.PREFIXES.TAG}:*`;
      const tagKeys = await redis.keys(tagPattern);

      const tags = [];

      // Check which tag sets contain this key
      for (const tagKey of tagKeys) {
        const isMember = await redis.sIsMember(tagKey, key);
        if (isMember) {
          // Extract tag name from tag key
          const tag = tagKey.replace(`${CACHE_CONFIG.PREFIXES.TAG}:`, "");
          tags.push(tag);
        }
      }

      return tags;
    } catch (error) {
      this.logError(CACHE_ERRORS.TAG_OPERATION_FAILED, "getTagsForKey", error, {
        key,
      });
      return [];
    }
  }

  /**
   * Get multiple values from cache (batch operation)
   * @param {string[]} keys - Array of cache keys
   * @returns {Promise<Object>} Object with key-value pairs
   */
  async mget(keys) {
    if (!this.isRedisAvailable || keys.length === 0) {
      return {};
    }

    try {
      const values = await Promise.race([
        redis.mGet(keys),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Batch read timeout")),
            CACHE_CONFIG.TIMEOUTS.READ
          )
        ),
      ]);

      const result = {};
      keys.forEach((key, index) => {
        if (values[index] !== null) {
          try {
            result[key] = JSON.parse(values[index]);
          } catch (parseError) {
            this.logError(
              CACHE_ERRORS.SERIALIZATION_ERROR,
              "mget",
              parseError,
              { key }
            );
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });

      return result;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.READ_TIMEOUT
        : CACHE_ERRORS.READ_FAILED;
      this.logError(errorType, "mget", error, { keyCount: keys.length });
      return {}; // Return empty object on error - fallback to database
    }
  }

  /**
   * Set multiple values in cache (batch operation)
   * @param {Object} keyValuePairs - Object with key-value pairs
   * @param {number} ttl - Time to live in seconds
   * @param {Object} tagMap - Optional mapping of keys to tags
   * @returns {Promise<boolean>} Success status
   */
  async mset(keyValuePairs, ttl, tagMap = {}) {
    if (!this.isRedisAvailable || Object.keys(keyValuePairs).length === 0) {
      return false;
    }

    try {
      const pipeline = redis.multi();

      // Set all key-value pairs with TTL
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        try {
          const serializedValue = JSON.stringify(value);
          pipeline.setEx(key, ttl, serializedValue);
        } catch (serializeError) {
          this.logError(
            CACHE_ERRORS.SERIALIZATION_ERROR,
            "mset",
            serializeError,
            { key }
          );
        }
      });

      // Add tags if provided
      Object.entries(tagMap).forEach(([key, tags]) => {
        if (Array.isArray(tags) && tags.length > 0) {
          tags.forEach((tag) => {
            const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
            pipeline.sAdd(tagKey, key);
            pipeline.expire(
              tagKey,
              Math.max(...Object.values(CACHE_CONFIG.TTL)) + 3600
            );
          });
        }
      });

      await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Batch write timeout")),
            CACHE_CONFIG.TIMEOUTS.WRITE
          )
        ),
      ]);

      return true;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.WRITE_TIMEOUT
        : CACHE_ERRORS.WRITE_FAILED;
      this.logError(errorType, "mset", error, {
        keyCount: Object.keys(keyValuePairs).length,
        ttl,
      });
      return false;
    }
  }

  /**
   * Delete multiple values from cache (batch operation)
   * @param {string[]} keys - Array of cache keys to delete
   * @returns {Promise<number>} Number of keys deleted
   */
  async mdel(keys) {
    if (!this.isRedisAvailable || keys.length === 0) {
      return 0;
    }

    try {
      const pipeline = redis.multi();

      // Delete all keys
      keys.forEach((key) => {
        pipeline.del(key);
      });

      // Remove keys from all tag sets
      const tagPattern = `${CACHE_CONFIG.PREFIXES.TAG}:*`;
      const tagKeys = await redis.keys(tagPattern);

      if (tagKeys.length > 0) {
        keys.forEach((key) => {
          tagKeys.forEach((tagKey) => {
            pipeline.sRem(tagKey, key);
          });
        });
      }

      await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Batch delete timeout")),
            CACHE_CONFIG.TIMEOUTS.DELETE
          )
        ),
      ]);

      // Return the number of keys we attempted to delete
      const deletedCount = keys.length;

      // Update stats
      if (deletedCount > 0) {
        this.stats.deletes += deletedCount;
      }

      if (CACHE_CONFIG.DEBUG?.ENABLED) {
        console.log(`[CACHE BATCH DEL] ${deletedCount} keys deleted`);
      }

      return deletedCount;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.DELETE_TIMEOUT
        : CACHE_ERRORS.DELETE_FAILED;
      this.logError(errorType, "mdel", error, { keyCount: keys.length });
      return 0;
    }
  }

  /**
   * Invalidate cache by tags (atomic operation)
   * @param {string[]} tags - Tags to invalidate
   * @returns {Promise<number>} Number of keys invalidated
   */
  async invalidateByTags(tags) {
    if (!this.isRedisAvailable || tags.length === 0) {
      return 0;
    }

    try {
      // Get all keys for the specified tags
      const allKeys = new Set();

      for (const tag of tags) {
        const keys = await this.getKeysByTag(tag);
        keys.forEach((key) => allKeys.add(key));
      }

      if (allKeys.size === 0) {
        return 0;
      }

      // Use atomic transaction to delete all keys and clean up tag sets
      const keysArray = Array.from(allKeys);
      const pipeline = redis.multi();

      // Delete all cache keys
      keysArray.forEach((key) => {
        pipeline.del(key);
      });

      // Remove keys from tag sets
      tags.forEach((tag) => {
        const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
        keysArray.forEach((key) => {
          pipeline.sRem(tagKey, key);
        });
      });

      const results = await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Tag invalidation timeout")),
            CACHE_CONFIG.TIMEOUTS.DELETE
          )
        ),
      ]);

      // Return the number of keys we found and attempted to delete
      // These keys were in the tag sets, so they should have been deleted
      const deletedCount = keysArray.length;

      // Update stats
      if (deletedCount > 0) {
        this.stats.deletes += deletedCount;
      }

      if (CACHE_CONFIG.DEBUG?.ENABLED) {
        console.log(
          `[CACHE INVALIDATION] ${deletedCount} keys invalidated for tags: [${tags.join(
            ", "
          )}]`
        );
        if (keysArray.length > 0) {
          console.log(
            `[CACHE INVALIDATION] Sample keys:`,
            keysArray.slice(0, 3)
          );
        }
      }

      return deletedCount;
    } catch (error) {
      this.logError(
        CACHE_ERRORS.INVALIDATION_FAILED,
        "invalidateByTags",
        error,
        { tags }
      );
      return 0; // Graceful degradation - continue processing
    }
  }

  /**
   * Atomic cache update operation
   * @param {string} key - Cache key
   * @param {any} value - New value
   * @param {number} ttl - Time to live
   * @param {string[]} tags - Tags to associate
   * @param {string[]} tagsToInvalidate - Tags to invalidate before setting
   * @returns {Promise<boolean>} Success status
   */
  async atomicUpdate(key, value, ttl, tags = [], tagsToInvalidate = []) {
    if (!this.isRedisAvailable) {
      return false;
    }

    try {
      const pipeline = redis.multi();

      // First, invalidate specified tags if any
      if (tagsToInvalidate.length > 0) {
        for (const tag of tagsToInvalidate) {
          const keysToDelete = await this.getKeysByTag(tag);
          keysToDelete.forEach((keyToDelete) => {
            pipeline.del(keyToDelete);
          });

          // Clean up tag sets
          const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
          pipeline.del(tagKey);
        }
      }

      // Set the new value
      let serializedValue;
      try {
        serializedValue = JSON.stringify(value);
      } catch (serializeError) {
        this.logError(
          CACHE_ERRORS.SERIALIZATION_ERROR,
          "atomicUpdate",
          serializeError,
          { key }
        );
        return false;
      }

      pipeline.setEx(key, ttl, serializedValue);

      // Add tags
      if (tags.length > 0) {
        tags.forEach((tag) => {
          const tagKey = `${CACHE_CONFIG.PREFIXES.TAG}:${tag}`;
          pipeline.sAdd(tagKey, key);
          pipeline.expire(
            tagKey,
            Math.max(...Object.values(CACHE_CONFIG.TTL)) + 3600
          );
        });
      }

      await Promise.race([
        pipeline.exec(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Atomic update timeout")),
            CACHE_CONFIG.TIMEOUTS.WRITE
          )
        ),
      ]);

      if (CACHE_CONFIG.STATS.ENABLED) {
        console.log(
          `Atomic update: ${key} (invalidated tags: [${tagsToInvalidate.join(
            ", "
          )}])`
        );
      }

      return true;
    } catch (error) {
      const errorType = error.message.includes("timeout")
        ? CACHE_ERRORS.WRITE_TIMEOUT
        : CACHE_ERRORS.WRITE_FAILED;
      this.logError(errorType, "atomicUpdate", error, {
        key,
        ttl,
        tags,
        tagsToInvalidate,
      });
      return false;
    }
  }

  /**
   * Remove key from all tag sets (helper method)
   * @param {string} key - Cache key to remove from tags
   * @returns {Promise<void>}
   */
  async removeKeyFromAllTags(key) {
    try {
      // Get all tag keys
      const tagPattern = `${CACHE_CONFIG.PREFIXES.TAG}:*`;
      const tagKeys = await redis.keys(tagPattern);

      // Remove key from each tag set
      if (tagKeys.length > 0) {
        const pipeline = redis.multi();
        tagKeys.forEach((tagKey) => {
          pipeline.sRem(tagKey, key);
        });

        await Promise.race([
          pipeline.exec(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Tag cleanup timeout")),
              CACHE_CONFIG.TIMEOUTS.WRITE
            )
          ),
        ]);
      }
    } catch (error) {
      this.logError(
        CACHE_ERRORS.TAG_OPERATION_FAILED,
        "removeKeyFromAllTags",
        error,
        { key }
      );
    }
  }

  /**
   * Warm cache with frequently accessed data
   * @param {Array<{key: string, fetcher: Function, ttl: number, tags: string[]}>} warmers - Array of cache warming configurations
   * @returns {Promise<{success: number, failed: number}>}
   */
  async warmCache(warmers) {
    if (
      !this.isRedisAvailable ||
      !Array.isArray(warmers) ||
      warmers.length === 0
    ) {
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    console.log(
      `[CACHE WARMING] Starting cache warming for ${warmers.length} entries...`
    );

    for (const warmer of warmers) {
      try {
        const { key, fetcher, ttl, tags = [] } = warmer;

        // Check if already cached
        const exists = await this.exists(key);
        if (exists) {
          console.log(`[CACHE WARMING] Skipping ${key} - already cached`);
          continue;
        }

        // Fetch data using provided fetcher function
        const data = await fetcher();

        // Cache the data
        const cached = await this.set(key, data, ttl, tags);

        if (cached) {
          success++;
          console.log(`[CACHE WARMING] Warmed ${key}`);
        } else {
          failed++;
          console.log(`[CACHE WARMING] Failed to warm ${key}`);
        }
      } catch (error) {
        failed++;
        console.log(`[CACHE WARMING] Error warming cache:`, error.message);
      }
    }

    console.log(
      `[CACHE WARMING] Complete - Success: ${success}, Failed: ${failed}`
    );

    return { success, failed };
  }

  /**
   * Refresh cache entry before expiration
   * @param {string} key - Cache key to refresh
   * @param {Function} fetcher - Function to fetch fresh data
   * @param {number} ttl - New TTL in seconds
   * @param {string[]} tags - Tags for the cache entry
   * @returns {Promise<boolean>} Success status
   */
  async refreshCache(key, fetcher, ttl, tags = []) {
    if (!this.isRedisAvailable) {
      return false;
    }

    try {
      // Fetch fresh data
      const data = await fetcher();

      // Update cache with new data
      const cached = await this.set(key, data, ttl, tags);

      if (cached && CACHE_CONFIG.STATS.ENABLED) {
        console.log(`[CACHE REFRESH] Refreshed ${key}`);
      }

      return cached;
    } catch (error) {
      this.logError(CACHE_ERRORS.WRITE_FAILED, "refreshCache", error, { key });
      return false;
    }
  }

  /**
   * Get cache entry with automatic refresh before expiration
   * @param {string} key - Cache key
   * @param {Function} fetcher - Function to fetch data on miss
   * @param {number} ttl - TTL in seconds
   * @param {string[]} tags - Tags for cache entry
   * @param {number} refreshThreshold - Refresh if TTL is below this (seconds)
   * @returns {Promise<any>} Cached or fetched data
   */
  async getWithRefresh(key, fetcher, ttl, tags = [], refreshThreshold = 300) {
    if (!this.isRedisAvailable) {
      return await fetcher();
    }

    try {
      // Try to get from cache
      const cached = await this.get(key, tags);

      if (cached !== null) {
        // Check remaining TTL
        const remainingTTL = await redis.ttl(key);

        // Refresh in background if TTL is low
        if (remainingTTL > 0 && remainingTTL < refreshThreshold) {
          // Non-blocking refresh
          this.refreshCache(key, fetcher, ttl, tags).catch((error) => {
            console.log(
              `[CACHE REFRESH] Background refresh failed for ${key}:`,
              error.message
            );
          });
        }

        return cached;
      }

      // Cache miss - fetch and cache
      const data = await fetcher();
      await this.set(key, data, ttl, tags);

      return data;
    } catch (error) {
      this.logError(CACHE_ERRORS.READ_FAILED, "getWithRefresh", error, { key });
      // Fallback to fetcher on error
      return await fetcher();
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

export { CacheService, cacheService };
