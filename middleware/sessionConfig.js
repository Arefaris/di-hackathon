import session from 'express-session';
import pgSession from 'connect-pg-simple';

const pgSessionStore = pgSession(session); // initialize session storage
const sessionMiddleware = (pool) => session({
    store: new pgSessionStore({
        pool: pool,
        tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === 'production', // true for HTTPS in production
        httpOnly: true, // Prevent client-side JS from accessing the cookie
        sameSite: 'lax' // CSRF protection
    }
});

export default sessionMiddleware;