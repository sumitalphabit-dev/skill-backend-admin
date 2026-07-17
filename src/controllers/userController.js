const userService = require('../services/userService');
const catchAsync = require('../middleware/catchAsync');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = catchAsync(async (req, res) => {
    const data = await userService.registerUser(req.body);
    res.status(201).json(data);
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const data = await userService.loginUser(email, password);
    res.json(data);
});

module.exports = {
    registerUser,
    loginUser
};
