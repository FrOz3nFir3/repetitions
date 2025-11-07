import { cleanupExpiredReviewItems } from "../models/cards/cards.model.js";

// Execute the cleanup function - cron jobs time and execution handled externally
cleanupExpiredReviewItems()
    .then(() => {
        console.log("Cleanup completed successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Cleanup failed:", error.message);
        process.exit(1);
    });

