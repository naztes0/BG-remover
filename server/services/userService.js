
/**
 * @module services/userService
 * @requires models/userModel
 * @requires configs/appConfig
 */

import userModel from "../models/userModel.js";
import config from "../configs/appConfig.js";


/**
 * @typedef {Object} CreditConfig
 * @property {number} max - Maximum number of credits
 * @property {number} refreshTimer - Credit refill interval in ms
 */

/** @type {CreditConfig} */
const creditConfig = config.credits;

/** @constant {number} */
export const MAX_CREDITS = creditConfig.max;

/** @constant {number} */
export const CREDIT_REFRESH_TIME = creditConfig.refreshTimer;


/**
 * Finds a user by their Clerk ID
 * 
 * @async
 * @function findUserByClerkId
 * @param {string} clerkId - The Clerk authentication ID to search for
 * @returns {Promise<Object|null>} User document or null if not found
 * 
 * @example
 * const user = await findUserByClerkId('clerk_123456');
 * if (user) {
 *   console.log(`Found user: ${user.email}`);
 * }
 */
export const findUserByClerkId = async (clerkId) => {
    return await userModel.findOne({ clerkId });
};

/**
 * Creates a new user with default credit balance
 * 
 * @async
 * @function createUser
 * @param {CreateUserData} userData - User data for creation
 * @returns {Promise<Object>} Created user document
 * 
 * @example
 * const newUser = await createUser({
 *   clerkId: 'clerk_123456',
 *   email: 'user@example.com',
 *   photo: 'https://example.com/photo.jpg',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 */
export const createUser = async (userData) => {
    return await userModel.create(userData);
};

/**
 * Updates an existing user's information
 * 
 * @async
 * @function updateUser
 * @param {string} clerkId - Clerk ID of user to update
 * @param {UpdateUserData} userData - New user data
 * @returns {Promise<Object|null>} Updated user document
 * 
 * @example
 * const updatedUser = await updateUser('clerk_123456', {
 *   firstName: 'Jane',
 *   lastName: 'Smith'
 * });
 */

export const updateUser = async (clerkId, userData) => {
    return await userModel.findOneAndUpdate({ clerkId }, userData, { new: true });
};

/**
 * Deletes a user by their Clerk ID
 * 
 * @async
 * @function deleteUser
 * @param {string} clerkId - Clerk ID of user to delete
 * @returns {Promise<Object|null>} Deleted user document
 * 
 * @example
 * const deletedUser = await deleteUser('clerk_123456');
 * if (deletedUser) {
 *   console.log(`Deleted user: ${deletedUser.email}`);
 * }
 */
export const deleteUser = async (clerkId) => {
    return await userModel.findOneAndDelete({ clerkId });
};

/**
 * Checks and updates a user's credit balance based on elapsed time
 * 
 * @async
 * @function checkAndUpdateCredits
 * @param {Object} user - User document
 * @returns {Promise<Object>} Updated credit information
 * 
 * @description This function:
 * - Checks if user has maximum credits and disables timer if so
 * - Calculates credits to add based on elapsed time since last update
 * - Updates user's credit balance and timer status
 * - Returns current credit status and timer information
 * 
 * @example
 * const user = await findUserByClerkId('clerk_123456');
 * const creditInfo = await checkAndUpdateCredits(user);
 * console.log(`User has ${creditInfo.credits} credits`);
 */
export const checkAndUpdateCredits = async (user) => {
    // If user has max credits, ensure the timer is off
    if (user.creditBalance >= MAX_CREDITS) {
        if (user.timerActive) {
            user.timerActive = false;
            user.nextCreditAt = null;
            await user.save();
        }

        return {
            credits: user.creditBalance,
            timerActive: false,
            nextCreditAt: null,
            timeRemaining: null
        };
    }

    // Check if it's time to add credits
    if (user.timerActive && user.nextCreditAt && new Date() >= new Date(user.nextCreditAt)) {
        // Calculate how many credits to add based on elapsed time
        const timePassedSinceLastUpdate = new Date() - new Date(user.lastCreditUpdate);
        const minutesPassedSinceLastUpdate = timePassedSinceLastUpdate / (1000 * 60);
        const creditsToAdd = Math.min(
            Math.floor(minutesPassedSinceLastUpdate / CREDIT_REFRESH_TIME),
            MAX_CREDITS - user.creditBalance
        );

        if (creditsToAdd > 0) {
            user.creditBalance += creditsToAdd;
            user.lastCreditUpdate = new Date();

            // If max credits reached, deactivate timer
            if (user.creditBalance >= MAX_CREDITS) {
                user.timerActive = false;
                user.nextCreditAt = null;
            } else {
                // Set time for next credit
                user.nextCreditAt = new Date(new Date().getTime() + CREDIT_REFRESH_TIME * 60 * 1000);
            }

            await user.save();
        }
    }

    // Calculate remaining time if timer is active
    let timeRemaining = null;
    if (user.timerActive && user.nextCreditAt) {
        timeRemaining = Math.max(0, new Date(user.nextCreditAt) - new Date());
    }

    return {
        credits: user.creditBalance,
        timerActive: user.timerActive,
        nextCreditAt: user.nextCreditAt,
        timeRemaining
    };
};


/**
 * Manages credit refill timer activation and status for a user
 * 
 * @async
 * @function manageCreditTimer
 * @param {Object} user - User document
 * @returns {Promise<TimerResult>} Timer management result
 * 
 * @description This function:
 * - Disables timer if user has maximum credits
 * - Activates timer if user has less than maximum credits and timer is off
 * - Returns current timer status and relevant information
 * 
 * @example
 * const user = await findUserByClerkId('clerk_123456');
 * const result = await manageCreditTimer(user);
 * console.log(result.message); // Timer status message
 */
export const manageCreditTimer = async (user) => {
    // If user has max credits, ensure the timer is off
    if (user.creditBalance >= MAX_CREDITS) {
        if (user.timerActive) {
            user.timerActive = false;
            user.nextCreditAt = null;
            await user.save();
        }

        return {
            success: true,
            message: "Max credits reached, timer disabled",
            timerActive: false,
            creditBalance: user.creditBalance
        };
    }

    // Activate the timer if it's turned off and user has less than max credits
    if (user.creditBalance < MAX_CREDITS && !user.timerActive) {
        // Set time for next credit
        user.nextCreditAt = new Date(new Date().getTime() + CREDIT_REFRESH_TIME * 60 * 1000);
        user.timerActive = true;
        user.lastCreditUpdate = new Date();
        await user.save();

        return {
            success: true,
            message: "Timer activated",
            timerActive: true,
            nextCreditAt: user.nextCreditAt,
            creditBalance: user.creditBalance
        };
    }

    // Timer is already running correctly
    return {
        success: true,
        message: "Timer status checked",
        timerActive: user.timerActive,
        nextCreditAt: user.nextCreditAt,
        creditBalance: user.creditBalance
    };
};
