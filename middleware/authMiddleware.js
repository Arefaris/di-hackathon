import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';
import AuthError from '../utils/AuthError.js';
import { signToken } from '../utils/jwt.js';
import { authConfig } from '../config/auth.js';

/**
 * Extracts JWT token from request headers or cookies
 * @param {Request} req - Express request object
 * @param {Object} options - Configuration options
 * @returns {string|null} - The extracted token or null
 */
function getTokenFromRequest(req, options = {}) {
    const {
        headerName = authConfig.accessToken.headerName,
        cookieName = authConfig.accessToken.cookieName, // Default cookie name for access token. Replace on invoke.
        scheme = authConfig.accessToken.scheme
    } = options;

    let token = null;

    // Priority 1: Authorization header
    if (
        req.headers[headerName.toLowerCase()] &&
        req.headers[headerName.toLowerCase()].startsWith(`${scheme} `)
    ) {
        token = req.headers[headerName.toLowerCase()].split(' ')[1];
    }

    // Priority 2: Cookie
    if (req.cookies && req.cookies[cookieName]) {
        token = req.cookies[cookieName];
    }

    if (!token || typeof token !== 'string' || token.length < 10) return null;

    return token;
}

/**
 * Middleware to protect routes requiring authentication
 * @async
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
    try {
        // 1) Retrieve token from Authorization header or cookies
        const accessToken = getTokenFromRequest(req, { cookieName: authConfig.accessToken.cookieName });

        if (!accessToken) {
            return next(new AuthError('You are not logged in! Please log in to get access.'));
        }

        // 2) Verify the token
        const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);

        // 3) Check if user still exists in the database
        const currentUser = await getUserById(decoded.id);
        if (!currentUser) {
            return next(new AuthError('The user belonging to this token no longer exists.'));
        }

        // 4) Attach user to request and response locals for future access
        req.user = currentUser;
        res.locals.user = currentUser; // Useful for template rendering
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return next(new AuthError('Invalid token. Please log in again!'));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AuthError('Your access token has expired. Please refresh your session.'));
        }
        next(err); // Pass other errors to the global error handler
    }
};

/**
 * Middleware to refresh the access token using a valid refresh token
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @throws {AuthError} When refresh token is missing, invalid, or expired
 * @returns {Promise<void>} Sends new access token in response or passes error to next middleware
 * */
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = getTokenFromRequest(req, { cookieName: authConfig.refreshToken.cookieName });

    if (!refreshToken) {
        return next(new AuthError('No refresh token provided. Please log in.'));
    }

    try {
        const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if the decoded token has a valid user ID
        if (!decoded || !decoded.id) {
            return next(new AuthError('Invalid refresh token.'));
        }

        // Check if refresh token matches the one stored in the database (i.e. not revoked)
        const stored = await findRefreshToken(refreshToken);
        if (!stored || stored.user_id !== decoded.id) {
            return next(new AuthError('Refresh token has been revoked or is invalid.'));
        }

        const user = await getUserById(decoded.id);
        if (!user) {
            return next(new AuthError('Invalid refresh token. User not found.'));
        }


        const newAccessToken = signToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

        res.cookie(authConfig.accessToken.cookieName, newAccessToken, {
            ...authConfig.accessToken.cookieOptions,
            expires: new Date(Date.now() + authConfig.accessToken.expiresIn)
        });

        res.status(200).json({
            status: 'success',
            token: newAccessToken,
            message: 'Access token refreshed successfully.'
        });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return next(new AuthError('Invalid or expired refresh token. Please log in again.'));
        }
        next(err);
    }
};