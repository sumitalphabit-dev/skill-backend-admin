const express = require('express');
const router = express.Router();
const {
    getSeminarEvents,
    getSeminarEventById,
    createSeminarEvent,
    updateSeminarEvent,
    deleteSeminarEvent,
    activateSeminarEvent
} = require('../controllers/seminarEventController');
const { upload } = require('../config/cloudinary');
const { createSeminarEventRules, updateSeminarEventRules } = require('../validators/seminarEventValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);

const uploadFields = upload.fields([
    { name: 'venueImage', maxCount: 1 }
]);

router.route('/')
    .get(getSeminarEvents)
    .post(uploadFields, createSeminarEventRules, validate, createSeminarEvent);

router.route('/:id')
    .get(getSeminarEventById)
    .put(uploadFields, updateSeminarEventRules, validate, updateSeminarEvent)
    .delete(deleteSeminarEvent);

router.patch('/:id/activate', activateSeminarEvent);

module.exports = router;
