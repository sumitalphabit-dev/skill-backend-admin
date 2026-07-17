const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlog
} = require('../controllers/blogController');

// Map routes to controller methods
router.route('/')
    .get(getBlogs);

router.route('/:slug')
    .get(getBlog);

module.exports = router;
