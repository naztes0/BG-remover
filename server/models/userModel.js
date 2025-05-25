/**
 * 
 * @module models/userModel
 * @requires mongoose
 */

import mongoose from "mongoose";

/**
 * User document structure
 * @typedef {Object} UserDocument
 * @property {string} clerkId - Unique Clerk authentication ID
 * @property {string} email - User's email address (unique)
 * @property {string} photo - URL to user's profile photo
 * @property {string} [firstName] - User's first name (optional)
 * @property {string} [lastName] - User's last name (optional)
 * @property {number} creditBalance - Current credit balance (default: 5)
 * @property {Date|null} nextCreditAt - Timestamp when next credit will be added
 * @property {boolean} timerActive - Whether credit refresh timer is active
 * @property {Date} lastCreditUpdate - Last time credits were updated
 */

/**
 * Mongoose schema definition for User collection
 * @type {mongoose.Schema<UserDocument>}
 * @description Defines the structure and validation rules for user documents in MongoDB
 */

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    creditBalance: { type: Number, default: 5 },
    nextCreditAt: { type: Date, default: null },
    timerActive: { type: Boolean, default: false },
    lastCreditUpdate: { type: Date, default: Date.now }
});


/**
 * Mongoose schema definition for User collection.
 * Defines the structure and validation rules for user documents in MongoDB.
 * @type {mongoose.Model<UserDocument>}
 
 * 
 * @example
 * // Create a new user
 * const newUser = new userModel({
 *   clerkId: 'clerk_123',
 *   email: 'user@example.com',
 *   photo: 'https://example.com/photo.jpg',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * await newUser.save();
 * 
 * @example
 * // Find user by clerk ID
 * const user = await userModel.findOne({ clerkId: 'clerk_123' });
 * 
 * @example
 * // Update user credits
 * await userModel.findByIdAndUpdate(userId, { 
 *   creditBalance: 4,
 *   timerActive: true 
 * });
 */
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;