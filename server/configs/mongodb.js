/** * @module configs/mongodb
 * @requires mongoose
 * @requires configs/appConfig
 */

import mongoose from "mongoose";
import config from "./appConfig.js";


/**
 * Establishes connection to MongoDB database
 * 
 * @async
 * @function connectDB
 * @description Connects to MongoDB using mongoose with configuration from appConfig.
 * Sets up connection event listeners and handles connection errors.
 * 
 * @returns {Promise<boolean>} Returns true if connection successful, false if failed
 * 
 * @example
 * // Connect to database
 * const isConnected = await connectDB();
 * if (isConnected) {
 *   console.log('Database connected successfully');
 * } else {
 *   console.log('Database connection failed');
 * }
 * 
 * @throws {Error} Logs MongoDB connection errors to console
 */


const connectDB = async () => {
    try {
        /**
        * Event listener for successful database connection
        */
        mongoose.connection.on("connected", () => {
            console.log("Database connected");
        });
        /**
         * Establish connection to MongoDB
         * Uses configuration from appConfig for URI, database name, and options
         */
        await mongoose.connect(`${config.db.uri}/${config.db.name}`, config.db.options);
        return true;
    } catch (error) {
        /**
        * Handle connection errors
        * @param {Error} error - MongoDB connection error
        */
        console.error("MongoDB connection error:", error);
        return false;
    }
}
export default connectDB