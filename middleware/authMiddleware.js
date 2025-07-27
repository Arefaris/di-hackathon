import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';
import ms from 'ms';

export const protect = async (req, res, next) => {
    try {
        let token;
        // 1) Retrieve token from Authorization header or cookies
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) { // Fallback to cookie if header is absent
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verify the token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists in the database
        const currentUser = await getUserById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // 4) Attach user to request and response locals for future access
        req.user = currentUser;
        res.locals.user = currentUser; // Useful for template rendering
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Your access token has expired. Please refresh your session.', 401));
        }
        next(err); // Pass other errors to the global error handler
    }
};

// Middleware to handle refresh token logic (optional but recommended)
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshJwt;

    if (!refreshToken) {
        return next(new AppError('No refresh token provided. Please log in.', 401));
    }

    try {
        const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Check if the decoded token has a valid user ID
        if (!decoded || !decoded.id) {
            return next(new AppError('Invalid refresh token.', 401));
        }
        
        // Check if refresh token matches the one stored in the database (i.e. not revoked)
        const stored = await findRefreshToken(refreshToken);
        if (!stored || stored.user_id !== decoded.id) {
            return next(new AppError('Refresh token has been revoked or is invalid.', 401));
        }

        const user = await getUserById(decoded.id);
        if (!user) {
            return next(new AppError('Invalid refresh token. User not found.', 401));
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
            return next(new AppError('Invalid or expired refresh token. Please log in again.', 401));
        }
        next(err);
    }
};