/**
 * @module middlewares/auth
 * @requires jsonwebtoken
 */
import jwt from 'jsonwebtoken'

/**
 * JWT token payload structure
 * @typedef {Object} TokenPayload
 * @property {string} clerkId - User's Clerk authentication ID
 * @property {number} [iat] - Token issued at timestamp
 * @property {number} [exp] - Token expiration timestamp
 */

/**
 * @callback NextFunction
 * @param {any} [err] - Optional error parameter
 * @returns {void}
 */

/**
 * Authentication middleware to decode JWT token and extract Clerk ID
 * 
 * @async
 * @function authUser
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.token - JWT token containing user authentication data
 * @param {Object} req.body - Request body (will be modified to include clerkId)
 * @param {Object} res - Express response object
  * @param {NextFunction} next - Express next function
 * @returns {Promise<void>} Calls next() on success or sends error response
 * 
 * @description This middleware function:
 * 1. Extracts JWT token from request headers
 * 2. Validates token presence and returns error if missing
 * 3. Decodes JWT token to extract user information (without verification)
 * 4. Adds clerkId from token payload to request body
 * 5. Calls next middleware in chain on successful authentication
 * 6. Returns unauthorized error if token is missing or invalid
 * 
 * @example
 * // Usage in route definition:
 * router.get('/protected', authUser, (req, res) => {
 *   // req.body.clerkId is now available
 *   console.log('Authenticated user:', req.body.clerkId);
 * });
 * 
 * // Required request header:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * // After middleware execution, req.body will contain:
 * {
 *   ...originalBody,
 *   "clerkId": "user_123456789"
 * }
 * 
 * // Error response if token missing:
 * {
 *   "success": false,
 *   "message": "Not authorized login again"
 * }
 * 
 * @security
 * - Uses jwt.decode() which does NOT verify token signature
 * - Token validation should be handled by Clerk on frontend
 * - This middleware only extracts clerkId for internal use
 * 
 * @throws {Error} Returns JSON error response if token missing or decoding fails
 */
//Middleware Function to deocde jwt token to get clerkId
const authUser = async (req, res, next) => {
    try {

        const { token } = req.headers
        if (!token) return res.json({ success: false, message: "Not authorized login again" })
        const token_decode = jwt.decode(token)
        req.body.clerkId = token_decode.clerkId
        next()

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export default authUser