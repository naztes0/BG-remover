/**
 * @module middlewares/multer
 * @requires multer
 */
import multer from "multer";
/**
 * Multer storage configuration for handling file uploads
 * 
 * @description Creates disk storage configuration for multer middleware.
 * Files are stored with timestamp-prefixed filenames to avoid naming conflicts.
 * 
 * @example
 * // Original filename: "photo.jpg"
 * // Stored filename: "1640995200000_photo.jpg"
 */

//creating multer middleware fro parsing formdata

const storage = multer.diskStorage({
    /**
    * Generates unique filename for uploaded files
    * 
    * @function filename
    * @param {Object} req - Express request object
    * @param {Express.Multer.File} file - Uploaded file information
    * @param {string} file.originalname - Original name of uploaded file
    * @param {Function} callback - Multer callback function
    * @param {null} callback.error - Error parameter (null for success)
    * @param {string} callback.filename - Generated filename
    * 
    * @description Callback function that generates unique filenames by:
    * 1. Getting current timestamp using Date.now()
    * 2. Prefixing original filename with timestamp
    * 3. Using underscore separator between timestamp and original name
    * 
    * @example
    * // Input file: "background-image.png"
    * // Generated filename: "1640995200000_background-image.png"
    */
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}_${file.originalname}`)
    }
})


/**
 * Configured multer middleware instance for file upload handling
 * 
 * @constant {multer.Multer}
 * @description Multer middleware configured with disk storage.
 * Used to handle multipart/form-data requests containing file uploads.
 * 
 * @example
 * // Usage in route for single file upload:
 * router.post('/upload', upload.single('image'), (req, res) => {
 *   console.log('Uploaded file:', req.file);
 *   // req.file contains:
 *   // {
 *   //   fieldname: 'image',
 *   //   originalname: 'photo.jpg',
 *   //   filename: '1640995200000_photo.jpg',
 *   //   path: 'uploads/1640995200000_photo.jpg',
 *   //   size: 124536,
 *   //   mimetype: 'image/jpeg'
 *   // }
 * });
 * 
 * // Usage in route for multiple files:
 * router.post('/upload-multiple', upload.array('images', 5), (req, res) => {
 *   console.log('Uploaded files:', req.files);
 * });
 * 
 * // Usage with field specification:
 * router.post('/upload-fields', upload.fields([
 *   { name: 'avatar', maxCount: 1 },
 *   { name: 'gallery', maxCount: 8 }
 * ]), (req, res) => {
 *   console.log('Files by field:', req.files);
 * });
 * 
 */
const upload = multer({ storage })

export default upload 