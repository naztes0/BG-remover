/**
 * @module controllers/ImageController
 * @requires services/userService
 * @requires services/imageService
 */

import { findUserByClerkId } from "../services/userService.js"
import { removeImageBackground } from "../services/imageService.js"



/**
 * Handles background removal from uploaded images
 * 
 * @async
 * @function removeBgImage
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.clerkId - User's Clerk authentication ID
 * @param {Object} req.file - Uploaded file from multer middleware
 * @param {string} req.file.path - Path to uploaded file
 * @param {string} req.file.mimetype - MIME type of uploaded file
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with operation result
 * 
 * @description This controller function:
 * 1. Extracts clerkId from authenticated request body
 * 2. Finds user by Clerk ID and validates existence
 * 3. Checks if user has sufficient credit balance (> 0)
 * 4. Sets MIME type from uploaded file to user object
 * 5. Calls image service to remove background using ClipDrop API
 * 6. Returns processed image and updated credit information
 * 7. Handles errors and returns appropriate error messages
 * 
 * @example
 * // POST /api/image/remove-bg
 * // Headers: { "token": "jwt_token_here" }
 * // Form data: { "image": file, "clerkId": "clerk_123" }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "resultImage": "data:image/jpeg;base64,/9j/4AAQ...",
 *   "creditBalance": 4,
 *   "timerActive": true,
 *   "nextCreditAt": "2024-01-15T10:30:00Z",
 *   "message": "Background Removed"
 * }
 * 
 * // Error responses:
 * {
 *   "success": false,
 *   "message": "User not found"
 * }
 * 
 * {
 *   "success": false,
 *   "message": "No credit balance",
 *   "creditBalance": 0
 * }
 * 
 * @throws {Error} Returns error response if user not found, insufficient credits, or processing fails
 */

/**
 * Controller response for background removal operation
 * @typedef {Object} RemoveBgResponse
 * @property {boolean} success - Operation success status
 * @property {string} message - Response message
 * @property {string} [resultImage] - Base64 encoded processed image (on success)
 * @property {number} [creditBalance] - Updated user credit balance (on success)
 * @property {boolean} [timerActive] - Credit timer status (on success)
 * @property {Date} [nextCreditAt] - Next credit refresh time (on success)
 */

const removeBgImage = async (req, res) => {
    try {
        const { clerkId } = req.body
        const user = await findUserByClerkId(clerkId);

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        if (user.creditBalance === 0) {
            return res.json({
                success: false,
                message: "No credit balance",
                creditBalance: user.creditBalance
            })
        }
        user.mime = req.file.mimetype;
        const result = await removeImageBackground(user, req.file.path);
        res.json({
            success: true,
            resultImage: result.resultImage,
            creditBalance: result.creditBalance,
            timerActive: result.timerActive,
            nextCreditAt: result.nextCreditAt,
            message: "Background Removed"
        });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export { removeBgImage }