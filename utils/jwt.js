import { createRefreshToken } from '../models/refreshTokenModel.js';

// Suppott function to sign a JWT token
// This function creates a JWT token with the user ID, secret, and expiration time
const signToken = (id, secret, expiresIn) => {
    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn,
    });
};

// Function to create and send JWT tokens
// This function generates both access and refresh tokens, stores them in cookies, and sends them in the response
const createSendToken = async (user, statusCode, req, res) => {
    const accessToken = signToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES_IN);
    // Get user agent and IP address from request headers
    const user_agent = req.headers['user-agent'] || req.ip || 'Unknown';
    const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // Store the refresh token in the database
    await createRefreshToken({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRES_IN.slice(0, -1) * 24 * 60 * 60 * 1000),
        user_agent,
        ip_address
    });

    // Set cookies for access token
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN.slice(0, -1) * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTP only for security in production
        sameSite: 'Lax',
    };

    // Set cookies for refresh token
    res.cookie('jwt', accessToken, cookieOptions);
    res.cookie('refreshJwt', refreshToken, {
        expires: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRES_IN.slice(0, -1) * 24 * 60 * 60 * 1000),  // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });


    // Remove sensitive data from user object and send response
    const { password_hash, ...safeUser } = user;
    res.status(statusCode).json({
        status: 'success',
        token: accessToken,
        user: safeUser
    });
};
export { signToken, createSendToken };