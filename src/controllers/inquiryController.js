const inquiryService = require('../services/inquiryService');
const catchAsync = require('../middleware/catchAsync');

// @desc    Submit a new demo class inquiry
// @route   POST /api/inquiries
// @access  Public
const submitInquiry = catchAsync(async (req, res) => {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({ success: true, data: inquiry });
});

module.exports = {
    submitInquiry
};
