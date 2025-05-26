/**
 * @module server
 * @requires dotenv/config
 * @requires express
 * @requires cors
 * @requires configs/mongodb
 * @requires routes/userRoutes
 * @requires routes/imageRoutes
 * @requires configs/appConfig
 * 
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import config from './configs/appConfig.js';

//App config

/**
 * Server configuration
 * 
 */

/**
  * Server port number from config (default: 4000)
 * @type {number}
 */
const PORT = config.server.port;

/**
 * Express application instance
 * @type {express.Application}
 * @description Main Express app configured with middleware and routes
 */
const app = express();


/**
 *  @description Express middleware configuration
 */

/**
 * JSON parsing middleware
 *@description Middleware to parse incoming JSON requests into req.body
 */
//Initialize Middlewares
app.use(express.json())

/**
 * CORS middleware
 * @function
 * @description Enables Cross-Origin Resource Sharing for all routes
 * Allows frontend applications to communicate with the API
 */
app.use(cors())



/**
 * Health check endpoint
 * @description Simple health check endpoint to verify server is running
 * 
 * @example
 * // GET /
 * // Response: "API Working"
 * 
 */
//API routes
app.get('/', (req, res) => res.send("API Working"))


/**
 * User management routes
 * @description Mounts user router for all user-related operations:
 * - POST /api/user/webhooks - Clerk authentication webhooks
 * - GET /api/user/credits - Get user credit information
 * - POST /api/user/check-timer - Manage credit refresh timer
 * 
 */
app.use('/api/user', userRouter)
/**
 * Image processing routes
 * @description Mounts image router for all image-related operations:
 * - POST /api/image/remove-bg - Remove background from uploaded images
 * 
 */
app.use('/api/image', imageRouter)


/**
 * Start Express server
 * @function
 * @description Starts the Express server on configured port
 * Logs success message when server is ready to accept connections
 * 
 * @example
 * // Console output:
 * // "Server Running on port 4000"
 */
app.listen(PORT, () => console.log("Server Running on port " + PORT))


/**
 * Initialize database connection
 * @function
 * @description Establishes connection to MongoDB database
 * Handles connection success and failure scenarios
 * 
 * @example
 * // Successful connection console output:
 * // "Database connected"
 * 
 * // Failed connection console output:
 * // "DB Connection Error: [error details]"
 */
connectDB()
  .then(() => {
  })
  .catch(err => {
    console.error("DB Connection Error:", err);
  });
