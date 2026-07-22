const express = require('express');
const router = express.Router();
const { getCurrentSeminarEvent } = require('../controllers/seminarEventController');

// GET /api/seminars/current
router.get('/current', getCurrentSeminarEvent);

module.exports = router;
