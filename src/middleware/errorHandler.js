const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    console.error('--- ERROR DETECTED ---');
    console.error(err);
    console.error('----------------------');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new AppError(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        err = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        err = new AppError(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message || 'Server Error'
    });
};

module.exports = errorHandler;
