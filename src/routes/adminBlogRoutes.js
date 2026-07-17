const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlogById,
    deleteBlogById
} = require('../controllers/blogController');
const { upload } = require('../config/cloudinary');
const { createBlogRules, updateBlogRules } = require('../validators/blogValidator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/authMiddleware');

// Protect all admin routes
router.use(protect);

router.route('/')
    .get(getBlogs)
    .post(upload.single('image'), createBlogRules, validate, createBlog);

router.route('/:id')
    .get(getBlogById)
    .put(upload.single('image'), updateBlogRules, validate, updateBlogById)
    .delete(deleteBlogById);

module.exports = router;
