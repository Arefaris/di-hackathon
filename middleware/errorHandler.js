const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // log error stack

    // Send a detailed error information in dev-mode and a general info in prod.  
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode || 500).json({
            message: err.message,
            error: err.stack
        });
    } else {
        res.status(err.statusCode || 500).json({
            message: 'Internal Server Error'
        });
    }
};

export default errorHandler;