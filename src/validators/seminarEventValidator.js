const { body } = require('express-validator');

const createSeminarEventRules = [
    body('batchId')
        .notEmpty().withMessage('Please add a batch identifier')
        .isString().withMessage('Batch identifier must be text')
        .trim(),

    body('topic')
        .notEmpty().withMessage('Please add a topic')
        .isString().withMessage('Topic must be text')
        .isLength({ max: 150 }).withMessage('Topic cannot be more than 150 characters')
        .trim(),

    body('date')
        .notEmpty().withMessage('Please add a date')
        .isISO8601().withMessage('Date must be a valid ISO date'),

    body('startTime')
        .notEmpty().withMessage('Please add a start time')
        .isString().withMessage('Start time must be text')
        .trim(),

    body('endTime')
        .notEmpty().withMessage('Please add an end time')
        .isString().withMessage('End time must be text')
        .trim(),

    body('mode')
        .optional()
        .isIn(['Offline', 'Online', 'Hybrid']).withMessage('Mode must be Offline, Online, or Hybrid'),

    body('venue')
        .notEmpty().withMessage('Please add a venue')
        .isString().withMessage('Venue must be text')
        .trim(),

    body('venueMapLink')
        .optional()
        .isString().withMessage('Venue map link must be text')
        .trim(),

    body('language')
        .optional()
        .isString().withMessage('Language must be text')
        .trim(),

    body('totalSeats')
        .optional()
        .isInt({ min: 1 }).withMessage('Total seats must be a positive integer')
];

const updateSeminarEventRules = [
    body('batchId')
        .optional()
        .notEmpty().withMessage('Batch identifier cannot be empty')
        .isString().withMessage('Batch identifier must be text')
        .trim(),

    body('topic')
        .optional()
        .notEmpty().withMessage('Topic cannot be empty')
        .isString().withMessage('Topic must be text')
        .isLength({ max: 150 }).withMessage('Topic cannot be more than 150 characters')
        .trim(),

    body('date')
        .optional()
        .isISO8601().withMessage('Date must be a valid ISO date'),

    body('startTime')
        .optional()
        .notEmpty().withMessage('Start time cannot be empty')
        .isString().withMessage('Start time must be text')
        .trim(),

    body('endTime')
        .optional()
        .notEmpty().withMessage('End time cannot be empty')
        .isString().withMessage('End time must be text')
        .trim(),

    body('mode')
        .optional()
        .isIn(['Offline', 'Online', 'Hybrid']).withMessage('Mode must be Offline, Online, or Hybrid'),

    body('venue')
        .optional()
        .notEmpty().withMessage('Venue cannot be empty')
        .isString().withMessage('Venue must be text')
        .trim(),

    body('venueMapLink')
        .optional()
        .isString().withMessage('Venue map link must be text')
        .trim(),

    body('language')
        .optional()
        .isString().withMessage('Language must be text')
        .trim(),

    body('totalSeats')
        .optional()
        .isInt({ min: 1 }).withMessage('Total seats must be a positive integer')
];

module.exports = {
    createSeminarEventRules,
    updateSeminarEventRules
};
