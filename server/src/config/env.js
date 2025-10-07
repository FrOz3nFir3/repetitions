/**
 * Environment Configuration
 * 
 * Centralized environment variable management.
 * Load dotenv once and export all environment variables.
 */

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: join(__dirname, "../../../.env") });

/**
 * Environment variables with defaults and validation
 * Variable names match sample.env exactly
 */
export const env = {
    // Server Configuration
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "80", 10),

    // Authentication & Security
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    COOKIE_SECRET: process.env.COOKIE_SECRET || "",

    // Database
    MONGO_URI: process.env.MONGO_URI || "",

    // Redis
    REDIS_URI: process.env.REDIS_URI || "",
    // Cache Configuration
    REDIS_CACHE_ENABLED: process.env.REDIS_CACHE_ENABLED !== "false", // Default: true
    REDIS_CACHE_DEBUG_ENABLED: process.env.REDIS_CACHE_DEBUG_ENABLED !== "true", // Default: false


    // Rate Limiting
    WHITELIST_IP: process.env.WHITELIST_IP?.split(",") || [],

    // Proxy Configuration
    ENABLE_PROXY: process.env.ENABLE_PROXY !== "false", // Default: true
};

/**
 * Validate required environment variables
 */
export function validateEnv() {
    const required = [
        "MONGO_URI",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "COOKIE_SECRET",
    ];

    const missing = required.filter((key) => !env[key]);

    if (missing.length > 0) {
        console.error(
            `❌ Missing required environment variables: ${missing.join(", ")}`
        );
        if (env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
}

// Validate on import
validateEnv();

export default env;
