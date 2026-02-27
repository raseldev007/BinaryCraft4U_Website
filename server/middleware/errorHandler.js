const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Log error with Winston (include request details for context)
    const logPayload = {
        method: req.method,
        url: req.originalUrl,
        statusCode,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    };

    if (statusCode >= 500) {
        logger.error(`[${statusCode}] ${message}`, logPayload);
    } else {
        logger.warn(`[${statusCode}] ${message}`, { ...logPayload, stack: undefined });
    }

    // Mongoose: Cast Error (invalid ObjectId)
    if (err.name === 'CastError') {
        message = `Resource not found`;
        statusCode = 404;
    }

    // Mongoose: Duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `Duplicate value for ${field}`;
        statusCode = 400;
    }

    // Mongoose: Validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map((val) => val.message).join(', ');
        statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token. Please log in again.';
        statusCode = 401;
    }
    if (err.name === 'TokenExpiredError') {
        message = 'Token expired. Please log in again.';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
