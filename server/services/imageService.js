//@ts-check
/**
 * 
 * @module services/imageService
 * @requires axios
 * @requires fs
 * @requires form-data
 * @requires models/userModel
 * @requires services/userService
 * @requires configs/appConfig
 */

import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";
import { MAX_CREDITS, CREDIT_REFRESH_TIME } from "./userService.js";
import config from "../configs/appConfig.js";



/**
 * Result of background removal operation
 * @typedef {Object} BackgroundRemovalResult
 * @property {string} resultImage - Base64 encoded image with background removed
 * @property {number} creditBalance - Updated user credit balance after operation
 * @property {boolean} timerActive - Whether credit refresh timer is active
 * @property {Date|null} nextCreditAt - When next credit will be added
 */
/**
 * Removes background from an image using ClipDrop API and manages user credits
 * 
 * @async
 * @function removeImageBackground
 * @param {Object} user - User document containing credit info and MIME type
 * @param {string} imagePath - File system path to the image to process
 * @returns {Promise<BackgroundRemovalResult>} Result containing processed image and updated credit info
 * 
 * @throws {Error} Throws error if API request fails or image processing encounters issues
 * 
 * @description This function:
 * 1. Creates a file stream from the provided image path
 * 2. Prepares FormData with the image file for API request
 * 3. Sends request to ClipDrop API for background removal
 * 4. Converts the response to base64 format
 * 5. Deducts one credit from user's balance
 * 6. Manages credit refresh timer based on remaining credits
 * 7. Updates user document in database
 * 8. Returns processed image and updated credit information
 * 
 * @example
 * // Remove background from user's uploaded image
 * const user = await findUserByClerkId('clerk_123456');
 * user.mime = 'image/jpeg'; // Set MIME type from uploaded file
 * 
 * try {
 *   const result = await removeImageBackground(user, '/path/to/image.jpg');
 *   console.log(`Credits remaining: ${result.creditBalance}`);
 *   console.log(`Timer active: ${result.timerActive}`);
 *   // result.resultImage contains the processed image as base64 string
 * } catch (error) {
 *   console.error('Background removal failed:', error.message);
 * }
 * 
 * @example
 * // Handle credit management after background removal
 * const result = await removeImageBackground(user, imagePath);
 * if (result.timerActive) {
 *   console.log(`Next credit at: ${result.nextCreditAt}`);
 * }
 */

// Function to remove background from an image 
export const removeImageBackground = async (user, imagePath) => {
    try {
        // File stream for the image
        const imageFile = fs.createReadStream(imagePath);
        const formdata = new FormData();
        formdata.append('image_file', imageFile);

        // Request to ClipDrop API for background removal
        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formdata, {
            headers: {
                'x-api-key': config.apiKeys.clipdrop,
            },
            responseType: "arraybuffer"
        });

        // Reuslt in base64 format
        const base64Image = Buffer.from(data, "binary").toString("base64");
        const resultImage = `data: ${user.mime};base64,${base64Image}`;

        const newCreditBalance = user.creditBalance - 1;
        //Cehck for timer 
        let timerActive = user.timerActive;
        let nextCreditAt = user.nextCreditAt;

        // If credits not maxed out, set timer for next credit
        if (newCreditBalance < MAX_CREDITS && !timerActive) {
            timerActive = true;
            nextCreditAt = new Date(new Date().getTime() + CREDIT_REFRESH_TIME * 60 * 1000);
        }

        // Upd user info
        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: newCreditBalance,
            timerActive,
            nextCreditAt,
            lastCreditUpdate: new Date()
        });

        return {
            resultImage,
            creditBalance: newCreditBalance,
            timerActive,
            nextCreditAt
        };
    } catch (error) {
        throw new Error(`Error removing background: ${error.message}`);
    }
};