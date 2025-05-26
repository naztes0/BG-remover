/**
 * @module routes/imageRoutes
 * @requires express
 * @requires controllers/ImageController
 * @requires middlewares/multer
 * @requires middlewares/auth
 */
import express from "express";
import { removeBgImage } from "../controllers/ImageController.js";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/auth.js";


/**
 * Express router instance for image-related API endpoints
 * @type {express.Router}
 */

const imageRouter = express.Router();

imageRouter.post('/remove-bg', upload.single("image"), authUser, removeBgImage)

export default imageRouter