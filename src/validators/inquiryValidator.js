const { body } = require('express-validator');

const createInquiryRules = [
    body('name')
        .notEmpty().withMessage('Please add a name')
        .isString().withMessage('Name must be text')
        .trim(),
        
    body('email')
        .notEmpty().withMessage('Please add an email')
        .isEmail().withMessage('Please add a valid email')
        .normalizeEmail(),
        
    body('contactNumber')
        .notEmpty().withMessage('Please add a contact number')
        .isString().withMessage('Contact number must be text')
        .trim(),
        
    body('skill')
        .notEmpty().withMessage('Please add a skill name')
        .isString().withMessage('Skill name must be text')
        .trim()
];

module.exports = {
    createInquiryRules
};
