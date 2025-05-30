/**
 * @module routes/userRoutes
 * @requires express
 * @requires controllers/UserController
 * @requires middlewares/auth
 */
import express from "express"
import { clerkWebhooks, userCredits, checkCreditTimer } from "../controllers/UserController.js"
import authUser from "../middlewares/auth.js"

/**
 * Express router instance for user-related API endpoints
 * @type {express.Router}
 * @description Router handling all user management operations including
 * Clerk webhook processing, credit queries, and timer management.
 */
const userRouter = express.Router()

/**
 * Webhook endpoint for Clerk authentication events
 * @name POST /webhooks
 * @controller clerkWebhooks - Handles Clerk user lifecycle events
 * 
 * @description This route processes webhooks from Clerk authentication service:
 * - **user.created**: Creates new user in database with default 5 credits
 * - **user.updated**: Updates existing user information
 * - **user.deleted**: Removes user from database
 * 
 * The route verifies webhook signatures using Svix for security.
 * 
 * @example
 * // Clerk sends webhook on user creation:
 * // POST /api/user/webhooks
 * // Headers: {
 * //   "svix-id": "msg_123...",
 * //   "svix-timestamp": "1640995200",
 * //   "svix-signature": "v1,signature_here"
 * // }
 * // Body: {
 * //   "type": "user.created",
 * //   "data": {
 * //     "id": "user_123456",
 * //     "email_addresses": [{"email_address": "user@example.com"}],
 * //     "first_name": "John",
 * //     "last_name": "Doe",
 * //     "profile_image_url": "https://example.com/photo.jpg"
 * //   }
 * // }
 * 
 * @example
 * // Success response (all webhook types):
 * {}
 * 
 * // Error response:
 * {
 *   "success": false,
 *   "message": "Webhook verification failed"
 * }
 */
userRouter.post('/webhooks', clerkWebhooks)

/**
 * Get user's current credit information
 * @name GET /credits
 * @middleware authUser - Authentication middleware to verify JWT token
 * @controller userCredits - Returns current credit balance and timer status
 * 
 * @description This route:
 * 1. Authenticates user via JWT token
 * 2. Finds user by Clerk ID
 * 3. Checks and updates credits based on elapsed time
 * 4. Returns current credit balance, timer status, and next credit time
 * 
 * The system automatically adds credits based on time elapsed since last update.
 * Credits refresh every 2 minutes up to a maximum of 5 credits.
 * 
 * @example
 * // Request
 * // GET /api/user/credits
 * // Headers: { "token": "jwt_token_here" }
 * 
 * // Success response:
 * {
 *   "success": true,
 *   "credits": 3,
 *   "timerActive": true,
 *   "nextCreditAt": "2024-01-15T10:30:00Z",
 *   "timeRemaining": 120000
 * }
 * 
 * // Response when user has max credits:
 * {
 *   "success": true,
 *   "credits": 5,
 *   "timerActive": false,
 *   "nextCreditAt": null,
 *   "timeRemaining": null
 * }
 * 
 * @example
 * // Error responses
 * // User not found:
 * {
 *   "success": false,
 *   "message": "User not found"
 * }
 * 
 * // Authentication error:
 * {
 *   "success": false,
 *   "message": "Not authorized login again"
 * }
 * 
 */
userRouter.get("/credits", authUser, userCredits)

/**
 * Check and manage user's credit refresh timer
 * @name POST /check-timer
 * @middleware authUser - Authentication middleware to verify JWT token
 * @controller checkCreditTimer - Manages credit timer activation/deactivation
 * 
 * @description This route manages the credit refresh timer:
 * - **Activates timer** if user has < 5 credits and timer is off
 * - **Deactivates timer** if user has 5 credits (maximum)
 * - **Returns status** of timer and credit information
 * 
 * The timer ensures users receive 1 credit every 2 minutes when below maximum.
 * 
 * @example
 * // Request
 * // POST /api/user/check-timer
 * // Headers: { "token": "jwt_token_here" }
 * 
 * // Success response (timer activated):
 * {
 *   "success": true,
 *   "message": "Timer activated",
 *   "timerActive": true,
 *   "nextCreditAt": "2024-01-15T10:30:00Z",
 *   "creditBalance": 3
 * }
 * 
 * // Success response (max credits reached):
 * {
 *   "success": true,
 *   "message": "Max credits reached, timer disabled",
 *   "timerActive": false,
 *   "creditBalance": 5
 * }
 * 
 * // Success response (timer already running):
 * {
 *   "success": true,
 *   "message": "Timer status checked",
 *   "timerActive": true,
 *   "nextCreditAt": "2024-01-15T10:25:00Z",
 *   "creditBalance": 2
 * }
 * 
 * @example
 * // Error responses
 * // User not found:
 * {
 *   "success": false,
 *   "message": "User not found"
 * }
 * 
 * // Authentication error:
 * {
 *   "success": false,
 *   "message": "Not authorized login again"
 * }
 * 
 */
userRouter.post("/check-timer", authUser, checkCreditTimer)

export default userRouter

