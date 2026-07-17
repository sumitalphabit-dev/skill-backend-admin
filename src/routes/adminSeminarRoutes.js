const express = require('express');
const router = express.Router();
const {
    getSeminarRegistrations,
    getSeminarRegistrationById,
    updateSeminarStatus,
    deleteSeminarRegistration,
    exportSeminarRegistrations,
    getSeminarStats
} = require('../controllers/seminarRegistrationController');
const { updateSeminarStatusRules } = require('../validators/seminarValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);

// Non-parameterized routes (must go before parameterized routes)
router.get('/export', exportSeminarRegistrations);
router.get('/stats', getSeminarStats);

router.route('/')
    .get(getSeminarRegistrations);

router.route('/:id')
    .get(getSeminarRegistrationById)
    .put(updateSeminarStatusRules, validate, updateSeminarStatus)
    .delete(deleteSeminarRegistration);

module.exports = router;
