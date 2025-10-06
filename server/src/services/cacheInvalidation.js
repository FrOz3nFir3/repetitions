/**
 * Cache Invalidation Service
 * 
 * This service implements complex invalidation patterns that mirror RTK Query's
 * tag-based invalidation system. It provides mapping functions for different
 * operation types and handles conditional invalidation logic.
 */

import { cacheService } from './cache.js';

/**
 * Complete invalidation mapping based on RTK Query patterns
 * Maps RTK Query invalidation scenarios to Redis cache tag invalidation
 */
export const invalidationMap = {
    // Card operations
    Card: ['Card'],

    /**
     * Card overview invalidation
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    CardOverview: (cardId) => [`CardOverview:${cardId}`],

    /**
     * Card flashcards invalidation
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    CardFlashcards: (cardId) => [`CardFlashcards:${cardId}`, `CardReviewQueue:${cardId}`],

    /**
     * Card quiz invalidation
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    CardQuiz: (cardId) => [`CardQuiz:${cardId}`, `CardReviewQueue:${cardId}`],

    /**
     * Card update with auto-detection (from patchUpdateCard)
     * Automatically detects the type of update and invalidates appropriate caches
     * @param {string} cardId - Card ID
     * @param {string} updateType - Type of update: 'flashcards', 'quiz', 'overview', or 'auto'
     * @param {Object} updateData - The actual update data for auto-detection
     * @returns {string[]} Tags to invalidate
     */
    cardUpdate: (cardId, updateType = 'auto', updateData = {}) => {
        const tags = [];

        let detectedType = updateType;

        // Auto-detect update type if not specified
        if (updateType === 'auto') {
            // Check for flashcard updates (question, answer fields)
            if (updateData.question || updateData.answer || updateData.flashcardId || updateData.deleteFlashcard) {
                detectedType = 'flashcards';
            }
            // Check for quiz updates (quizQuestion, quizAnswer, options, etc.)
            else if (updateData.quizQuestion || updateData.quizAnswer || updateData.options || updateData.option || updateData.minimumOptions || updateData.quizId || updateData.deleteQuiz) {
                detectedType = 'quiz';
            }
            // Check for overview/metadata updates
            else if (updateData['main-topic'] || updateData['sub-topic'] || updateData.description || updateData.category) {
                detectedType = 'overview';
            }
        }

        // Apply type-specific invalidation
        if (detectedType === 'flashcards') {
            // Only invalidate flashcard-related caches
            tags.push(`CardFlashcards:${cardId}`);
        } else if (detectedType === 'quiz') {
            // Only invalidate quiz-related caches
            tags.push(`CardQuiz:${cardId}`,);
        }

        // Overview changes happens always
        tags.push(`CardOverview:${cardId}`);

        // Always invalidate review queue later do this based on response body
        tags.push(`CardReviewQueue:${cardId}`);

        return tags;
    },

    // Review queue operations
    /**
     * Review queue invalidation
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    CardReviewQueue: (cardId) => [`CardReviewQueue:${cardId}`],

    /**
     * Review queue acceptance invalidation
     * When a review is accepted, it affects multiple aspects of the card
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    reviewQueueAccept: (cardId) => [
        `CardReviewQueue:${cardId}`,
        `CardOverview:${cardId}`,
        `CardFlashcards:${cardId}`,
        `CardQuiz:${cardId}`,
        'Card'
    ],

    // Report and progress operations
    Report: ['Report', 'Report:LIST'],

    /**
     * Specific report invalidation
     * @param {string} reportId - Report ID
     * @returns {string[]} Tags to invalidate
     */
    ReportById: (reportId) => [`Report:${reportId}`, 'Report:LIST'],

    // User operations
    User: ['User'],

    /**
     * Specific user invalidation
     * @param {string} userId - User ID
     * @returns {string[]} Tags to invalidate
     */
    UserById: (userId) => [`User:${userId}`],

    // Review progress operations
    /**
     * Regular review data invalidation
     * @param {string} reviewId - Review ID
     * @returns {string[]} Tags to invalidate
     */
    RegularReviewData: (reviewId) => [
        `RegularReviewData:${reviewId}`,
        'RegularReviewData:LIST',
        'Report:LIST',
        `Report:${reviewId}`
    ],

    /**
     * Focus review data invalidation
     * @param {string} reviewId - Review ID
     * @returns {string[]} Tags to invalidate
     */
    FocusReviewData: (reviewId) => [`FocusReviewData:${reviewId}`],

    /**
     * Focus quiz data invalidation
     * @param {string} quizId - Quiz ID
     * @returns {string[]} Tags to invalidate
     */
    FocusQuizData: (quizId) => [`FocusQuizData:${quizId}`],

    /**
     * Quiz progress with conditional invalidation
     * Mirrors RTK Query's conditional invalidation for quiz progress
     * @param {string} cardId - Card ID
     * @param {boolean} skipFocusQuizInvalidation - Whether to skip focus quiz invalidation
     * @returns {string[]} Tags to invalidate
     */
    quizProgress: (cardId, skipFocusQuizInvalidation = false) => {
        const tags = ['Report'];
        if (!skipFocusQuizInvalidation) {
            tags.push(`FocusQuizData:${cardId}`);
        }
        return tags;
    },

    /**
     * Weak cards update with conditional invalidation
     * Mirrors RTK Query's conditional invalidation for weak cards
     * @param {string} cardId - Card ID
     * @param {boolean} skipFocusReviewInvalidation - Whether to skip focus review invalidation
     * @param {boolean} skipRegularReviewInvalidation - Whether to skip regular review invalidation
     * @returns {string[]} Tags to invalidate
     */
    weakCards: (cardId, skipFocusReviewInvalidation = false, skipRegularReviewInvalidation = false) => {
        const tags = ['Report:LIST', `Report:${cardId}`];

        if (!skipRegularReviewInvalidation) {
            tags.push(`RegularReviewData:${cardId}`, 'RegularReviewData:LIST');
        }

        if (!skipFocusReviewInvalidation) {
            tags.push(`FocusReviewData:${cardId}`);
        }

        return tags;
    },

    // Reviewer management
    /**
     * Reviewers invalidation
     * @param {string} cardId - Card ID
     * @returns {string[]} Tags to invalidate
     */
    Reviewers: (cardId) => [`Reviewers:${cardId}`]
};

/**
 * Cache Invalidation Service Class
 * Provides high-level methods for cache invalidation based on operation types
 */
export class CacheInvalidationService {
    /**
     * Invalidate cache for card creation
     * @param {Object} cardData - Created card data
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateCardCreation(cardData) {
        const tags = invalidationMap.Card;
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for card update
     * @param {string} cardId - Card ID
     * @param {Object} updateData - Update data
     * @param {string} updateType - Optional update type override
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateCardUpdate(cardId, updateData, updateType = 'auto') {
        const tags = invalidationMap.cardUpdate(cardId, updateType, updateData);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for review queue acceptance
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateReviewQueueAccept(cardId) {
        const tags = invalidationMap.reviewQueueAccept(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for review queue rejection
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateReviewQueueReject(cardId) {
        const tags = invalidationMap.CardReviewQueue(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for quiz progress update
     * @param {string} cardId - Card ID
     * @param {boolean} skipFocusQuizInvalidation - Whether to skip focus quiz invalidation
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateQuizProgress(cardId, skipFocusQuizInvalidation = false) {
        const tags = invalidationMap.quizProgress(cardId, skipFocusQuizInvalidation);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for review progress update
     * @param {string} cardId - Card ID
     * @param {string} userId - User ID (optional)
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateReviewProgress(cardId, userId = null) {
        const tags = invalidationMap.RegularReviewData(cardId);
        if (userId) {
            tags.push(`Report:${userId}`);
        }
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for weak cards update
     * @param {string} cardId - Card ID
     * @param {boolean} skipFocusReviewInvalidation - Whether to skip focus review invalidation
     * @param {boolean} skipRegularReviewInvalidation - Whether to skip regular review invalidation
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateWeakCards(cardId, skipFocusReviewInvalidation = false, skipRegularReviewInvalidation = false) {
        const tags = invalidationMap.weakCards(cardId, skipFocusReviewInvalidation, skipRegularReviewInvalidation);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for user update
     * @param {string} userId - User ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateUserUpdate(userId) {
        const tags = [...invalidationMap.User, ...invalidationMap.UserById(userId)];
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for reviewer management
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateReviewers(cardId) {
        const tags = invalidationMap.Reviewers(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for focus review data
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateFocusReview(cardId) {
        const tags = invalidationMap.FocusReviewData(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for focus quiz data
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateFocusQuiz(cardId) {
        const tags = invalidationMap.FocusQuizData(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Invalidate cache for struggling quiz update
     * @param {string} cardId - Card ID
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateStrugglingQuiz(cardId) {
        const tags = invalidationMap.FocusQuizData(cardId);
        return await cacheService.invalidateByTags(tags);
    }

    /**
     * Generic invalidation method that accepts operation type and parameters
     * @param {string} operation - Operation type from invalidationMap
     * @param {...any} params - Parameters for the operation
     * @returns {Promise<number>} Number of keys invalidated
     */
    async invalidateByOperation(operation, ...params) {
        if (typeof invalidationMap[operation] === 'function') {
            const tags = invalidationMap[operation](...params);
            return await cacheService.invalidateByTags(tags);
        } else if (Array.isArray(invalidationMap[operation])) {
            return await cacheService.invalidateByTags(invalidationMap[operation]);
        } else {
            console.log(`Unknown invalidation operation: ${operation}`);
            return 0;
        }
    }

    /**
     * Batch invalidation for multiple operations
     * @param {Array} operations - Array of {operation, params} objects
     * @returns {Promise<number>} Total number of keys invalidated
     */
    async batchInvalidate(operations) {
        const allTags = new Set();

        // Collect all tags from all operations
        for (const { operation, params = [] } of operations) {
            if (typeof invalidationMap[operation] === 'function') {
                const tags = invalidationMap[operation](...params);
                tags.forEach(tag => allTags.add(tag));
            } else if (Array.isArray(invalidationMap[operation])) {
                invalidationMap[operation].forEach(tag => allTags.add(tag));
            }
        }

        // Perform single batch invalidation
        return await cacheService.invalidateByTags(Array.from(allTags));
    }
}

// Create singleton instance
export const cacheInvalidationService = new CacheInvalidationService();

/**
 * Utility functions for extracting invalidation parameters from requests
 */
export const invalidationUtils = {
    /**
     * Extract card ID from various request sources
     * @param {Object} req - Express request object
     * @returns {string|null} Card ID
     */
    extractCardId(req) {
        return req.params.id || req.body._id || req.params.cardId || req.body.cardId || req.query.cardId || null;
    },

    /**
     * Extract user ID from various request sources
     * @param {Object} req - Express request object
     * @returns {string|null} User ID
     */
    extractUserId(req) {
        return (req.token.id || null);
    },

    /**
     * Extract skip flags from request
     * @param {Object} req - Express request object
     * @returns {Object} Skip flags object
     */
    extractSkipFlags(req) {
        const query = req.query || {};
        const body = req.body || {};

        return {
            skipFocusQuizInvalidation: query.skipFocusQuizInvalidation === 'true' || body.skipFocusQuizInvalidation === true,
            skipFocusReviewInvalidation: query.skipFocusReviewInvalidation === 'true' || body.skipFocusReviewInvalidation === true,
            skipRegularReviewInvalidation: query.skipRegularReviewInvalidation === 'true' || body.skipRegularReviewInvalidation === true
        };
    },

    /**
     * Determine update type from request data
     * @param {Object} updateData - Update data from request body
     * @returns {string} Update type: 'flashcards', 'quiz', 'overview', or 'unknown'
     */
    determineUpdateType(updateData) {
        // Check for flashcard updates (question, answer fields)
        if (updateData.question || updateData.answer || updateData.flashcardId || updateData.deleteFlashcard) {
            return 'flashcards';
        }
        // Check for quiz updates (quizQuestion, quizAnswer, options, etc.)
        if (updateData.quizQuestion || updateData.quizAnswer || updateData.options || updateData.option || updateData.minimumOptions || updateData.quizId || updateData.deleteQuiz) {
            return 'quiz';
        }
        // Check for overview/metadata updates
        if (updateData['main-topic'] || updateData['sub-topic'] || updateData.description || updateData.category) {
            return 'overview';
        }
        return 'unknown';
    }
};