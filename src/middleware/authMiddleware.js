const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('./catchAsync');

const protect = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const jwtSecret = process.env.JWT_SECRET || 'your_fallback_secret_key';
            const decoded = jwt.verify(token, jwtSecret);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            throw new AppError('Not authorized', 401);
        }
    }

    if (!token) {
        throw new AppError('Not authorized, no token', 401);
    }
});

module.exports = { protect };
