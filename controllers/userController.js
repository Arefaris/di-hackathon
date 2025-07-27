import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    createUser,
    getUserByUsername,
    getAllUsers,
    getUserById,
    updateUserById
} from '../models/userModel.js';
import { createRefreshToken } from '../models/refreshTokenModel.js';
import AppError from '../middleware/appError.js';

// Suppott function to sign a JWT token
// This function creates a JWT token with the user ID, secret, and expiration time
const signToken = (id, secret, expiresIn) => {
    return jwt.sign({ id }, secret, {
        expiresIn: expiresIn,
    });
};

// Function to create and send JWT tokens
// This function generates both access and refresh tokens, stores them in cookies, and sends them in the response
const createSendToken = async (user, statusCode, res) => {
    const accessToken = signToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    const refreshToken = signToken(user.id, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES_IN);

  
    // await updateUserById(user.id, { refresh_token: refreshToken });
    await createRefreshToken({
        user_id: user.id,
        token: refreshToken,
        expires_at: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRES_IN.slice(0, -1) * 24 * 60 * 60 * 1000),
        user_agent: null, 
        ip_address: null 
    });

    // Set cookies for access token
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN.slice(0, -1) * 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTP only for security in production
        sameSite: 'Lax', 
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // Set cookies for refresh token
    res.cookie('jwt', accessToken, cookieOptions);
    res.cookie('refreshJwt', refreshToken, { 
        expires: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRES_IN.slice(0, -1) * 24 * 60 * 60 * 1000),  // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });


    // Убираем хэш пароля из ответа
    user.password_hash = undefined; // Важно!

    res.status(statusCode).json({
        status: 'success',
        token: accessToken, // Можно не отправлять токен в теле ответа, если он уже в куках
        user: { id: user.id, username: user.username }
    });
};

// User registration handler
// This function handles user registration, checks for existing users, hashes the password, and creates a new user
export const registerUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            return next(new AppError('Username already taken.', 409));
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [newUser] = await createUser({ username, password_hash });
        res.status(201).json({ msg: "User registered", user: { id: newUser.id, username: newUser.username } });
    } catch (err) {
        next(err);
    }
};


export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);
        const isMatch = user && await bcrypt.compare(password, user.password_hash);

        if (!user || !isMatch) {
            return next(new AppError('Invalid credentials', 401));
        }

        //Save user data in a session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.isLoggedIn = true;
        req.session.cookie.expires = new Date(Date.now() + 86400000);
        req.session.modified = true;
        await req.session.save();
        res.status(200).json({ msg: "Login successful", user: { id: user.id, username: user.username } });
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return next(new AppError('Failed to log out due to server error.', 500));
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ msg: "Logout successful" });
        });
    } catch (err) {
        next(err);
    }
};

export const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return next(new AppError('Unauthorized', 401));
    }
    next();
};

export const getAllUsersHandler = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users.map(({ id, username }) => ({ id, username })));
    } catch (err) {
        next(err);
    }
};

export const getUserByIdHandler = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await getUserById(id);
        if (!user) {
            return next(new AppError(`User with ID ${id} not found.`, 404));
        }
        res.status(200).json({ id: user.id, username: user.username });
    } catch (err) {
        next(err);
    }
};

export const updateUserByIdHandler = async (req, res, next) => {
    const { id } = req.params;
    const { username, password } = req.body;
    try {
        const updates = {};
        if (username) updates.username = username;
        if (password) updates.password_hash = await bcrypt.hash(password, 10);
        const updatedUser = await updateUserById(id, updates);
        if (!updatedUser) {
            return next(new AppError(`User with ID ${id} not found.`, 404));
        }

        res.status(200).json({ msg: "User updated", user: { id: updatedUser.id, username: updatedUser.username } });
    } catch (err) {
        next(err);
    }
};