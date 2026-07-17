const express = require('express');
const router = express.Router();
const { getMeetings, getMeetingById } = require('../controllers/meetingController');

router.route('/')
    .get(getMeetings);

router.route('/:id')
    .get(getMeetingById);

module.exports = router;
