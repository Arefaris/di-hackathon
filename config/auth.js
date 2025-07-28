import ms from 'ms';

const baseCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
};

export const authConfig = {
    accessToken: {
        cookieName: 'jwt',
        headerName: 'Authorization',
        scheme: 'Bearer',
        expiresIn: ms(process.env.JWT_EXPIRES_IN || '1h'), // e.g. 1 hour
        cookieOptions: {... baseCookieOptions} // Additional and specific options can be set here
    },
    refreshToken: {
        cookieName: 'refreshJwt',
        expiresIn: ms(process.env.JWT_REFRESH_EXPIRES_IN || '7d'), // e.g. 7 days
        cookieOptions: {... baseCookieOptions} // Additional and specific options can be set here
    }
};

export default authConfig;