export const isAuthenticated = (req, res, next) => {
    if (req.session?.userId) {
        return next();
    }
    res.redirect('/login');
};

export const isNotAuthenticated = (req, res, next) => {
    if (req.session?.userId) {
        return res.redirect('/chat');
    }
    next();
};

export default { isAuthenticated, isNotAuthenticated };
