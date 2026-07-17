const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { registerForSeminar } = require('../controllers/seminarRegistrationController');
const { registerSeminarRules } = require('../validators/seminarValidator');
const { validate } = require('../middleware/validate');

// Rate limiter: max 5 registrations per 10 minutes per IP
const registrationLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many registration attempts from this IP. Please try again after 10 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/register', registrationLimiter, registerSeminarRules, validate, registerForSeminar);

module.exports = router;
