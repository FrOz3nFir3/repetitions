/**
 * Cache Warming Utilities
 * 
 * Provides utilities to pre-populate cache with frequently accessed data
 * on application startup or on-demand.
 */

import { cacheService } from '../services/cache.js';
import { CACHE_CONFIG } from '../config/cache.config.js';

/**
 * Example cache warming configurations
 * These can be customized based on your application's needs
 */
export const cacheWarmingConfigs = [
    // Add your cache warming configurations here
    // Example:
    // {
    //     key: 'app:categories:all',
    //     fetcher: async () => {
    //         // Fetch categories from database
    //         return await Category.find({});
    //     },
    //     ttl: CACHE_CONFIG.TTL.CATEGORY,
    //     tags: ['Category'],
    // },
];

/**
 * Warm cache on application startup
 * @returns {Promise<void>}
 */
export async function warmCacheOnStartup() {
    if (!CACHE_CONFIG.ENABLED) {
        console.log('[CACHE WARMING] Caching disabled - skipping cache warming');
        return;
    }

    console.log('[CACHE WARMING] Starting cache warming on application startup...');

    try {
        const result = await cacheService.warmCache(cacheWarmingConfigs);
        console.log(`[CACHE WARMING] Startup warming complete - Success: ${result.success}, Failed: ${result.failed}`);
    } catch (error) {
        console.log('[CACHE WARMING] Error during startup warming:', error.message);
    }
}

/**
 * Create a cache warmer for a specific data type
 * @param {string} type - Cache type (user, card, etc.)
 * @param {string} identifier - Unique identifier
 * @param {Function} fetcher - Function to fetch data
 * @param {Object} params - Additional parameters
 * @param {string[]} tags - Cache tags
 * @returns {Object} Cache warmer configuration
 */
export function createCacheWarmer(type, identifier, fetcher, params = {}, tags = []) {
    const key = cacheService.generateCacheKey(type, identifier, params);
    const ttl = cacheService.getTTLForType(type);

    return {
        key,
        fetcher,
        ttl,
        tags,
    };
}

/**
 * Warm cache for frequently accessed endpoints
 * This can be called periodically or on-demand
 * @param {Array} warmers - Array of cache warmer configurations
 * @returns {Promise<{success: number, failed: number}>}
 */
export async function warmFrequentlyAccessedData(warmers) {
    if (!CACHE_CONFIG.ENABLED) {
        return { success: 0, failed: 0 };
    }

    return await cacheService.warmCache(warmers);
}

/**
 * Schedule periodic cache warming
 * @param {number} intervalMs - Interval in milliseconds
 * @param {Array} warmers - Array of cache warmer configurations
 */
export function schedulePeriodicWarming(intervalMs, warmers) {
    if (!CACHE_CONFIG.ENABLED) {
        console.log('[CACHE WARMING] Caching disabled - skipping periodic warming');
        return null;
    }

    console.log(`[CACHE WARMING] Scheduling periodic cache warming every ${intervalMs / 1000}s`);

    return setInterval(async () => {
        try {
            await warmFrequentlyAccessedData(warmers);
        } catch (error) {
            console.log('[CACHE WARMING] Error during periodic warming:', error.message);
        }
    }, intervalMs);
}
