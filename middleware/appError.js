class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode; // HTTP status code
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Operational vs. Programming error
        this.isOperational = true; // Mark as operational error
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;