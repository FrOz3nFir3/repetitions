/**
 * Cache Middleware for GET Request Interception
 * 
 * This middleware implements caching for GET requests only, providing:
 * - Cache key generation based on request URL and parameters
 * - Cache hit logic to return cached responses immediately
 * - Cache miss handling and response caching after database queries
 * - Proper TTL assignment based on endpoint type and configuration
 * - Tag assignment based on response data and endpoint patterns
 */

import { cacheService } from '../services/cache.js';
import { CACHE_CONFIG, CACHE_TYPES } from '../config/cache.config.js';

/**
 * Cache middleware for GET request interception
 * Only processes GET requests and provides transparent caching
 * 
 * @param {Object} options - Middleware configuration options
 * @param {string} options.cacheType - Cache type for TTL assignment (optional)
 * @param {Function} options.tagExtractor - Function to extract tags from request/response (optional)
 * @param {boolean} options.skipCache - Skip caching for this request (optional)
 * @returns {Function} Express middleware function
 */
export function cacheMiddleware(options = {}) {
    return async (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Skip caching if disabled or explicitly skipped
        if (!CACHE_CONFIG.ENABLED || options.skipCache) {
            return next();
        }

        try {
            // Generate cache key based on request URL and parameters
            const cacheKey = generateCacheKey(req, options.cacheType);

            // Skip caching if key generation returned null (e.g., unauthenticated user-specific route)
            if (!cacheKey) {
                return next();
            }

            // Check cache for existing data
            const cachedData = await cacheService.get(cacheKey);

            if (cachedData) {
                // Cache hit - return cached response immediately
                if (CACHE_CONFIG.DEBUG.ENABLED && CACHE_CONFIG.DEBUG.LOG_CACHE_HITS) {
                    console.log(`[CACHE HIT] ${req.method} ${req.originalUrl}`);
                }

                // Set cache headers to indicate cached response
                res.set('X-Cache', 'HIT');
                res.set('X-Cache-Key', cacheKey);

                // Strip ETag and Last-Modified headers to prevent 304 responses
                // When serving from Redis cache, always return 200 with full data
                const headers = { ...(cachedData.headers || {}) };
                delete headers['etag'];
                delete headers['ETag'];
                delete headers['last-modified'];
                delete headers['Last-Modified'];

                // Return cached response with appropriate status and headers
                return res.status(cachedData.statusCode || 200)
                    .set(headers)
                    .json(cachedData.body);
            }

            // Cache miss - continue to next middleware and intercept response
            if (CACHE_CONFIG.DEBUG.ENABLED && CACHE_CONFIG.DEBUG.LOG_CACHE_MISSES) {
                console.log(`[CACHE MISS] ${req.method} ${req.originalUrl}`);
            }

            // Store original response methods for interception
            const originalSend = res.send;
            const originalJson = res.json;
            const originalStatus = res.status;
            let responseStatusCode = 200;
            let responseHeaders = {};
            let responseBody = null;
            let responseSent = false;

            // Override res.status to capture status code
            res.status = function (code) {
                responseStatusCode = code;
                return originalStatus.call(this, code);
            };

            // Override res.json to capture response data
            res.json = function (data) {
                if (!responseSent) {
                    responseBody = data;
                    responseSent = true;

                    // Cache the response after sending it
                    setImmediate(() => {
                        cacheResponse(req, {
                            statusCode: responseStatusCode,
                            headers: responseHeaders,
                            body: data
                        }, cacheKey, options);
                    });
                }

                // Set cache headers to indicate cache miss
                this.set('X-Cache', 'MISS');
                this.set('X-Cache-Key', cacheKey);

                return originalJson.call(this, data);
            };

            // Override res.send to capture non-JSON responses
            res.send = function (data) {
                if (!responseSent) {
                    responseBody = data;
                    responseSent = true;

                    const contentType = this.get('Content-Type');

                    // Only cache JSON responses
                    if (contentType?.includes('application/json')) {
                        // Parse JSON string if needed
                        let bodyData = data;
                        if (typeof data === 'string') {
                            try {
                                bodyData = JSON.parse(data);
                            } catch (e) {
                                // Ignore parse errors
                            }
                        }

                        setImmediate(() => {
                            cacheResponse(req, {
                                statusCode: responseStatusCode,
                                headers: responseHeaders,
                                body: bodyData
                            }, cacheKey, options);
                        });
                    }
                }

                // Set cache headers to indicate cache miss
                this.set('X-Cache', 'MISS');
                this.set('X-Cache-Key', cacheKey);

                return originalSend.call(this, data);
            };

            // Continue to next middleware
            next();

        } catch (error) {
            // Log cache error but don't interrupt request flow
            console.log(`Cache middleware error for ${req.method} ${req.originalUrl}:`, error.message);
            next();
        }
    };
}

/**
 * Generate cache key based on request URL and parameters
 * 
 * @param {Object} req - Express request object
 * @param {string} cacheType - Optional cache type for key generation
 * @returns {string|null} Generated cache key or null if caching should be skipped
 */
function generateCacheKey(req, cacheType) {
    // Extract relevant parts from request
    const baseUrl = req.baseUrl || '';
    const path = req.path || '';
    const query = req.query || {};

    // Create a clean URL path
    const fullPath = `${baseUrl}${path}`.replace(/\/+/g, '/');

    // Determine cache type from URL if not provided
    const type = cacheType || inferCacheTypeFromUrl(fullPath);

    // Generate identifier from path (remove leading slash and replace slashes with colons)
    let identifier = fullPath.replace(/^\//, '').replace(/\//g, ':') || 'root';

    // For user-specific routes, include user ID in cache key for isolation
    // This prevents one user from accessing another user's cached data
    if (isUserSpecificRoute(fullPath)) {
        const userId = req.token?.id;
        if (userId) {
            // Use the user's MongoDB _id to namespace the cache key
            identifier = `user:${userId}:${identifier}`;
        } else {
            // If no user ID, don't cache user-specific data
            // This prevents caching for unauthenticated requests
            return null;
        }
    }

    // Use cache service to generate key with query parameters
    return cacheService.generateCacheKey(type, identifier, query);
}

/**
 * Check if a route contains user-specific data that requires user isolation
 * 
 * @param {string} path - URL path
 * @returns {boolean} True if route is user-specific
 */
function isUserSpecificRoute(path) {
    // Routes that contain user-specific data
    const userSpecificPatterns = [
        '/user/progress',
        '/user/stats',
        '/user/quiz-progress',
        '/user/review-progress',
        '/user/report',
        '/user/focus-review',
        '/user/focus-quiz',
        '/user/authed'
    ];

    return userSpecificPatterns.some(pattern => path.includes(pattern));
}

/**
 * Infer cache type from URL path for TTL assignment
 * 
 * @param {string} path - URL path
 * @returns {string} Cache type
 */
function inferCacheTypeFromUrl(path) {
    // Map URL patterns to cache types
    if (path.includes('/user') || path.includes('/users')) {
        return CACHE_TYPES.USER;
    }
    if (path.includes('/card')) {
        return CACHE_TYPES.CARD;
    }
    if (path.includes('/category') || path.includes('/categories')) {
        return CACHE_TYPES.CATEGORY;
    }
    if (path.includes('/progress') || path.includes('/stats') || path.includes('/report')) {
        return CACHE_TYPES.PROGRESS;
    }
    if (path.includes('/review') || path.includes('/queue')) {
        return CACHE_TYPES.REVIEW_QUEUE;
    }
    if (path.includes('/search')) {
        return CACHE_TYPES.SEARCH;
    }

    // Default cache type
    return 'default';
}

/**
 * Cache the response data with appropriate TTL and tags
 * 
 * @param {Object} req - Express request object
 * @param {Object} responseData - Response data to cache
 * @param {string} cacheKey - Cache key
 * @param {Object} options - Middleware options
 */
async function cacheResponse(req, responseData, cacheKey, options) {
    try {
        // Handle 304 Not Modified - skip caching (client already has data)
        if (responseData.statusCode === 304) {
            return;
        }

        // Only cache successful responses (2xx status codes)
        if (responseData.statusCode < 200 || responseData.statusCode >= 300) {
            return;
        }

        // Don't cache empty responses or errors
        if (!responseData.body || (typeof responseData.body === 'object' && responseData.body.error)) {
            return;
        }

        // Determine cache type and TTL
        const cacheType = options.cacheType || inferCacheTypeFromUrl(req.path);
        const ttl = cacheService.getTTLForType(cacheType);

        // Extract tags for cache invalidation
        const tags = extractTagsFromRequest(req, responseData, options.tagExtractor);

        // Cache the response
        const success = await cacheService.set(cacheKey, responseData, ttl, tags);

        if (CACHE_CONFIG.DEBUG.ENABLED && !success) {
            console.log(`[CACHE] Failed to cache ${req.originalUrl}`);
        }

    } catch (error) {
        console.log(`Error caching response for ${req.originalUrl}:`, error.message);
    }
}

/**
 * Extract cache tags from request and response for invalidation
 * 
 * @param {Object} req - Express request object
 * @param {Object} responseData - Response data
 * @param {Function} customTagExtractor - Custom tag extraction function
 * @returns {string[]} Array of cache tags
 */
function extractTagsFromRequest(req, responseData, customTagExtractor) {
    const tags = [];

    // Use custom tag extractor if provided
    if (typeof customTagExtractor === 'function') {
        try {
            const customTags = customTagExtractor(req, responseData);
            if (Array.isArray(customTags)) {
                tags.push(...customTags);
            }
        } catch (error) {
            console.log('Error in custom tag extractor:', error.message);
        }
    }

    // Extract standard tags based on URL patterns and response data
    const path = req.path;
    const fullPath = req.originalUrl || `${req.baseUrl || ''}${req.path}`;
    const params = req.params || {};
    const query = req.query || {};

    // Add base tags based on URL patterns
    if (fullPath.includes('/card')) {
        tags.push('Card');

        // Add specific card tags if card ID is present
        const cardId = params.id || params.cardId || query.cardId;
        if (cardId) {
            // Add view-specific tags based on query parameters
            const view = query.view;

            // Only add CardOverview tag for overview view or when no view is specified
            if (!view || view === 'overview') {
                tags.push(`CardOverview:${cardId}`);
            }

            if (view === 'edit_flashcards' || view === 'review' || view === 'review_text') {
                tags.push(`CardFlashcards:${cardId}`);
            }
            if (view === 'edit_quizzes' || view === 'quiz') {
                tags.push(`CardQuiz:${cardId}`);
            }
            if (fullPath.includes('/review-queue')) {
                tags.push(`CardReviewQueue:${cardId}`);
            }
        }

        // Extract category from response data for list caching
        if (responseData && responseData.body) {
            const body = responseData.body;
            // Handle single card response
            if (body.card && body.card.category) {
                tags.push(`CardCategory:${body.card.category}`);
            }
            // Handle array of cards response
            if (Array.isArray(body.cards)) {
                body.cards.forEach(card => {
                    if (card.category) {
                        tags.push(`CardCategory:${card.category}`);
                    }
                    if (card._id) {
                        tags.push(`CardOverview:${card._id}`);
                    }
                });
            }
            // Handle paginated response
            if (body.data && Array.isArray(body.data)) {
                body.data.forEach(card => {
                    if (card.category) {
                        tags.push(`CardCategory:${card.category}`);
                    }
                    if (card._id) {
                        tags.push(`CardOverview:${card._id}`);
                    }
                });
            }
        }

        // Extract category from URL params (for /cards/:category endpoint)
        if (params.category) {
            tags.push(`CardCategory:${params.category}`);
        }
    }

    if (fullPath.includes('/user')) {
        // For user-specific routes, ONLY use user-specific tags to prevent cross-user invalidation
        const userId = req.token?.id || params.id || params.userId || query.userId;
        if (userId) {
            tags.push(`User:${userId}`);

            // Add report tags for progress/stats endpoints (check without leading slash for progress)
            if (fullPath.includes('progress') || fullPath.includes('/stats') || fullPath.includes('/report')) {
                tags.push(`Report:${userId}`);
            }
        }
    }

    // Focus review endpoints - ONLY use user-specific tags for authenticated users
    if (fullPath.includes('/review') || fullPath.includes('/focus-review')) {
        let reviewId = params.id || params.reviewId || params.card_id || query.reviewId;

        // If not in params, try to extract from URL path
        if (!reviewId && fullPath.includes('/focus-review/') || fullPath.includes('/review/')) {
            const match = fullPath.match(/\/focus-review\/([a-f0-9]+)/);
            if (match) {
                reviewId = match[1];
            }
        }

        if (reviewId) {
            // Only add user-specific tag if authenticated to prevent cross-user invalidation
            const userId = req.token?.id;
            if (userId) {
                tags.push(`User:${userId}:FocusReviewData:${reviewId}`);
            }
        }
    }

    // Regular review progress endpoints - ONLY use user-specific tags for authenticated users
    if (fullPath.includes('/review-progress')) {
        let reviewId = params.id || params.reviewId || params.card_id || query.reviewId;

        // If not in params, try to extract from URL path
        if (!reviewId && fullPath.includes('/review-progress/')) {
            const match = fullPath.match(/\/review-progress\/([a-f0-9]+)/);
            if (match) {
                reviewId = match[1];
            }
        }

        if (reviewId) {
            // Only add user-specific tag if authenticated to prevent cross-user invalidation
            const userId = req.token?.id;
            if (userId) {
                tags.push(`User:${userId}:RegularReviewData:${reviewId}`);
            }
        }
    }

    // Focus quiz endpoints - ONLY use user-specific tags for authenticated users
    if (fullPath.includes('/quiz') || fullPath.includes('/focus-quiz')) {
        let quizId = params.id || params.quizId || query.quizId;

        // If not in params, try to extract from URL path
        if (!quizId && fullPath.includes('/focus-quiz/') || fullPath.includes('/quiz/')) {
            const match = fullPath.match(/\/focus-quiz\/([a-f0-9]+)/);
            if (match) {
                quizId = match[1];
            }
        }

        if (quizId) {
            // Only add user-specific tag if authenticated to prevent cross-user invalidation
            const userId = req.token?.id;
            if (userId) {
                tags.push(`User:${userId}:FocusQuizData:${quizId}`);
            }
        }
    }

    if (fullPath.includes('/reviewers')) {
        const cardId = params.id || params.cardId;
        if (cardId) {
            tags.push(`Reviewers:${cardId}`);
        }
    }

    // Remove duplicates and return
    return [...new Set(tags)];
}

/**
 * Create cache middleware with specific configuration for different route types
 */
export const createCacheMiddleware = {
    /**
     * Cache middleware for card routes
     */
    cards: (options = {}) => cacheMiddleware({
        cacheType: CACHE_TYPES.CARD,
        ...options
    }),

    /**
     * Cache middleware for user routes
     */
    users: (options = {}) => cacheMiddleware({
        cacheType: CACHE_TYPES.USER,
        ...options
    }),

    /**
     * Cache middleware for progress/report routes
     */
    progress: (options = {}) => cacheMiddleware({
        cacheType: CACHE_TYPES.PROGRESS,
        ...options
    }),

    /**
     * Cache middleware for review queue routes
     */
    reviewQueue: (options = {}) => cacheMiddleware({
        cacheType: CACHE_TYPES.REVIEW_QUEUE,
        ...options
    }),

    /**
     * Cache middleware for search routes
     */
    search: (options = {}) => cacheMiddleware({
        cacheType: CACHE_TYPES.SEARCH,
        ...options
    }),

    /**
     * Generic cache middleware with auto-detection
     */
    auto: (options = {}) => cacheMiddleware(options)
};