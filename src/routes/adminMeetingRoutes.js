const express = require('express');
const router = express.Router();
const {
    getMeetings,
    getMeetingById,
    createMeeting,
    updateMeetingById,
    deleteMeetingById
} = require('../controllers/meetingController');
const { upload } = require('../config/cloudinary');
const { createMeetingRules, updateMeetingRules } = require('../validators/meetingValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);

const uploadFields = upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
]);

router.route('/')
    .get(getMeetings)
    .post(uploadFields, createMeetingRules, validate, createMeeting);

router.route('/:id')
    .get(getMeetingById)
    .put(uploadFields, updateMeetingRules, validate, updateMeetingById)
    .delete(deleteMeetingById);

module.exports = router;
