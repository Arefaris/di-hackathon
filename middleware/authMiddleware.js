import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';
import AuthError from '../utils/AppError.js';
import AuthError from '../utils/AuthError.js';
import { signToken } from '../utils/jwt.js';
import ms from 'ms';

function getTokenFromRequest(req, options = {}) {
    const {
        headerName = 'Authorization',
        cookieName = 'jwt',
        scheme = 'Bearer'
    } = options;

    // Priority 1: Authorization header
    if (
        req.headers[headerName.toLowerCase()] &&
        req.headers[headerName.toLowerCase()].startsWith(`${scheme} `)
    ) {
        return req.headers[headerName.toLowerCase()].split(' ')[1];
    }

    // Priority 2: Cookie
    if (req.cookies && req.cookies[cookieName]) {
        return req.cookies[cookieName];
    }

    return null;
}

export const protect = async (req, res, next) => {
    try {
        // 1) Retrieve token from Authorization header or cookies
        const token = getTokenFromRequest(req, { cookieName: 'jwt' });

        if (!token) {
            return next(new AuthError('You are not logged in! Please log in to get access.'));
        }

        // 2) Verify the token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

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

// Middleware to handle refresh token logic (optional but recommended)
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = getTokenFromRequest(req, { cookieName: 'refreshJwt' });

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

        const cookieOptions = {
            expires: new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN)),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

        res.cookie('jwt', newAccessToken, cookieOptions);

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