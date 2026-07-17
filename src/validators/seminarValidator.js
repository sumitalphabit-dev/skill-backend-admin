const { body } = require('express-validator');

const registerSeminarRules = [
    body('name')
        .notEmpty().withMessage('Please add your name')
        .isString().withMessage('Name must be text')
        .isLength({ max: 100 }).withMessage('Name cannot be more than 100 characters')
        .trim(),

    body('phone')
        .notEmpty().withMessage('Please add a phone number')
        .isString().withMessage('Phone must be a string')
        .matches(/^[0-9]{10}$/).withMessage('Please add a valid 10-digit phone number')
        .trim(),

    body('email')
        .notEmpty().withMessage('Please add an email')
        .isEmail().withMessage('Please add a valid email')
        .normalizeEmail()
        .trim(),

    body('college')
        .notEmpty().withMessage('Please add your college/school name')
        .isString().withMessage('College name must be text')
        .isLength({ max: 150 }).withMessage('College name cannot be more than 150 characters')
        .trim(),

    body('course')
        .notEmpty().withMessage('Please add your current course/stream')
        .isString().withMessage('Course must be text')
        .isLength({ max: 100 }).withMessage('Course cannot be more than 100 characters')
        .trim(),

    body('city')
        .notEmpty().withMessage('Please add your city')
        .isString().withMessage('City must be text')
        .isLength({ max: 100 }).withMessage('City cannot be more than 100 characters')
        .trim(),

    body('source')
        .optional()
        .isIn(['Instagram', 'Friend / Referral', 'College Notice', 'Google Search', 'Other'])
        .withMessage('Source must be one of: Instagram, Friend / Referral, College Notice, Google Search, Other'),

    body('seminarBatch')
        .notEmpty().withMessage('Please specify the seminar batch')
        .isString().withMessage('Seminar batch must be text')
        .trim()
];

const updateSeminarStatusRules = [
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['registered', 'attended', 'no-show', 'cancelled'])
        .withMessage('Status must be one of: registered, attended, no-show, cancelled')
];

module.exports = {
    registerSeminarRules,
    updateSeminarStatusRules
};
