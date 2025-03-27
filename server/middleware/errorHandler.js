// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Set default error status and message
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Server Error';

    // Log error for server-side tracking (optional)
    console.error(`Error: ${errorMessage}`);

    // Mongoose validation error handling
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors: validationErrors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message: `${duplicateField} already exists`,
            error: 'Duplicate Key Error'
        });
    }

    // Cast Error (usually from invalid MongoDB ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({
            message: 'Invalid resource ID',
            error: err.message
        });
    }

    // JWT Authentication Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid authentication token',
            error: 'Unauthorized'
        });
    }

    // Token Expiration Error
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Authentication token has expired',
            error: 'Token Expired'
        });
    }

    // Generic error response
    res.status(statusCode).json({
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Custom error class for throwing specific errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export { errorHandler, AppError };