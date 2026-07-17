const User = require('../models/User');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET || 'your_fallback_secret_key';
    return jwt.sign({ id }, jwtSecret, { expiresIn: '30d' });
};

const registerUser = async (userData) => {
    const { name, email, password } = userData;
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists', 400);
    }

    const user = await User.create({ name, email, password });
    if (!user) {
        throw new AppError('Invalid user data', 400);
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    };
};

module.exports = {
    registerUser,
    loginUser
};
