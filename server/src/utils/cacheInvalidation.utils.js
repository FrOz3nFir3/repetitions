/**
 * Cache Invalidation Utilities
 * 
 * Utility functions for extracting invalidation parameters from requests
 * and determining appropriate cache invalidation strategies.
 */

/**
 * Extract card ID from various request sources
 * @param {Object} req - Express request object
 * @returns {string|null} Card ID
 */
export function extractCardId(req) {
    return req.params.id || req.params.cardId || req.body._id || req.body.cardId || req.query.cardId || null;
}

/**
 * Extract user ID from various request sources
 * @param {Object} req - Express request object
 * @returns {string|null} User ID
 */
export function extractUserId(req) {
    return req.params.id || req.params.userId || req.body.userId || req.query.userId || (req.user && req.user.id) || null;
}

/**
 * Extract skip flags from request for conditional invalidation
 * @param {Object} req - Express request object
 * @returns {Object} Skip flags object
 */
export function extractSkipFlags(req) {
    const query = req.query || {};
    const body = req.body || {};

    return {
        skipFocusQuizInvalidation: query.skipFocusQuizInvalidation === 'true' || body.skipFocusQuizInvalidation === true,
        skipFocusReviewInvalidation: query.skipFocusReviewInvalidation === 'true' || body.skipFocusReviewInvalidation === true,
        skipRegularReviewInvalidation: query.skipRegularReviewInvalidation === 'true' || body.skipRegularReviewInvalidation === true
    };
}

/**
 * Determine update type from request data
 * @param {Object} updateData - Update data from request body
 * @returns {string} Update type: 'flashcards', 'quiz', 'overview', or 'unknown'
 */
export function determineUpdateType(updateData) {
    if (updateData.flashcards || updateData.flashcard_front || updateData.flashcard_back) {
        return 'flashcards';
    }
    if (updateData.quiz || updateData.quiz_question || updateData.quiz_answers || updateData.quiz_correct_answer) {
        return 'quiz';
    }
    if (updateData.title || updateData.description || updateData.category || updateData.overview) {
        return 'overview';
    }
    return 'unknown';
}

/**
 * Extract review ID from request
 * @param {Object} req - Express request object
 * @returns {string|null} Review ID
 */
export function extractReviewId(req) {
    return req.params.reviewId || req.params.card_id || req.body.reviewId || req.body.cardId || null;
}

/**
 * Extract quiz ID from request
 * @param {Object} req - Express request object
 * @returns {string|null} Quiz ID
 */
export function extractQuizId(req) {
    return req.params.quizId || req.params.card_id || req.body.quizId || req.body.cardId || null;
}

/**
 * Determine if request is a mutation (non-GET)
 * @param {Object} req - Express request object
 * @returns {boolean} True if mutation request
 */
export function isMutationRequest(req) {
    return req.method !== 'GET';
}

/**
 * Determine if response is successful (2xx status code)
 * @param {Object} res - Express response object
 * @returns {boolean} True if successful response
 */
export function isSuccessfulResponse(res) {
    return res.statusCode >= 200 && res.statusCode < 300;
}