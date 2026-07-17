const express = require('express');
const router = express.Router();
const { submitInquiry } = require('../controllers/inquiryController');
const { createInquiryRules } = require('../validators/inquiryValidator');
const { validate } = require('../middleware/validate');

router.route('/')
    .post(createInquiryRules, validate, submitInquiry);

module.exports = router;
