import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        // 1) Получаем токен из заголовка или куки
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) { // Если токен в куках
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Верифицируем токен
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // 3) Проверяем, существует ли пользователь (мог быть удален)
        const currentUser = await getUserById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        // 4) Если все ок, прикрепляем пользователя к запросу
        req.user = currentUser;
        res.locals.user = currentUser; // Может быть полезно для рендеринга шаблонов
        next();
    } catch (err) {
        // Обработка различных ошибок JWT
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token. Please log in again!', 401));
        }
        if (err.name === 'TokenExpiredError') {
            // Если токен истек, можно попробовать обновить
            // Для этого нужен refresh token
            // return next(new AppError('Your token has expired! Please log in again.', 401));
            return next(new AppError('Your access token has expired. Please refresh your session.', 401));
        }
        next(err); // Прочие ошибки
    }
};

// Middleware для обработки refresh-токенов (опционально, но рекомендуется)
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshJwt;

    if (!refreshToken) {
        return next(new AppError('No refresh token provided. Please log in.', 401));
    }

    try {
        const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await getUserById(decoded.id);

        if (!user) {
            return next(new AppError('Invalid refresh token. User not found.', 401));
        }

        //Check if the refresh token is valid and matches the one stored in the database (didn't revoke)
        const stored = await getRefreshTokenByUserId(user.id); 
        if (!stored || stored.token !== refreshToken) {
            return next(new AppError('Refresh token revoked.', 401));
        }

        const newAccessToken = signToken(user.id, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_EXPIRES_IN.slice(0, -1) * 60 * 60 * 1000),
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            // sameSite: 'Lax',
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