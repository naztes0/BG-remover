/**
 * @module configs/appConfig
 
 */

/**
 * Credit system configuration
 * @typedef {Object} CreditConfig
 * @property {number} max - Maximum number of credits per user
 * @property {number} refreshTimer - Time in minutes between credit refreshes
 */

/**
 * Server configuration
 * @typedef {Object} ServerConfig
 * @property {number} port - Server port number
 */

/**
 * Database configuration
 * @typedef {Object} DatabaseConfig
 * @property {string} uri - MongoDB connection URI
 * @property {string} name - Database name
 * @property {Object} options - MongoDB connection options
 * @property {number} options.serverSelectionTimeoutMS - Server selection timeout
 * @property {number} options.connectTimeoutMS - Connection timeout
 */

/**
 * Clerk authentication configuration
 * @typedef {Object} ClerkConfig
 * @property {string} webhookSecret - Webhook secret key for Clerk authentication
 */

/**
 * API keys configuration
 * @typedef {Object} APIKeysConfig
 * @property {string} clipdrop - ClipDrop API key for background removal
 * @property {ClerkConfig} clerk - Clerk configuration object
 */

/**
 * Main application configuration object
 * @typedef {Object} AppConfig
 * @property {CreditConfig} credits - Credit system configuration
 * @property {ServerConfig} server - Server configuration
 * @property {DatabaseConfig} db - Database configuration
 * @property {APIKeysConfig} apiKeys - API keys and authentication configuration
 */

/**
 * Application configuration containing all settings for the BG Remover application
 * @type {AppConfig}
 * @constant
 */

const config = {
    /**
    * Credit system configuration
    * @type {CreditConfig}
    */
    credits: {
        /** Maximum number of credits per user */
        max: 5,
        /** Time in minutes between credit refreshes */
        refreshTimer: 2,
    },
    /**
     * Server configuration
     * @type {ServerConfig}
     */
    server: {
        port: process.env.PORT || 4000,
    },


    /**
    * MongoDB database configuration
    * @type {DatabaseConfig}
    */
    db: {
        /** MongoDB connection URI from environment or localhost default */
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
        name: 'bg-removal',
        options: {
            /** Server selection timeout in milliseconds */
            serverSelectionTimeoutMS: 5000,
            /** Connection timeout in milliseconds */
            connectTimeoutMS: 5000,
        },
    },
    /**
     * API keys and authentication configuration
     * @type {APIKeysConfig}
     */
    apiKeys: {
        /** ClipDrop API key for background removal service */
        clipdrop: process.env.CLIPDROP_API,
        clerk: {
            /** Webhook secret for verifying Clerk webhooks */
            webhookSecret: process.env.CLERK_WEBHOOK_SECRET,
        },
    }

}

export default config;
