import AppError from './appError.js';


export const validateUsernameAndPassword = (req, res, next) => {
    let { username, password } = req.body;
    if (!username || !password) {
        return next(new AppError('Username and password are required.', 400));
    }
    req.body.username = username.trim();
    req.body.password = password.trim();
    next();
};

export const validateUpdate = (req, res, next) => {
    const { username, password } = req.body;
    if (!username && !password) {
        return next(new AppError('Provide at least one field: username or password.', 400));
    }
    next();
};