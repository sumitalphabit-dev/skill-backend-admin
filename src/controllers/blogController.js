const blogService = require('../services/blogService');
const catchAsync = require('../middleware/catchAsync');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = catchAsync(async (req, res) => {
    const blogs = await blogService.getAllBlogs();
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
const getBlog = catchAsync(async (req, res) => {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    res.status(200).json({ success: true, data: blog });
});

// @desc    Get single blog by ID (Admin)
// @route   GET /api/admin/blogs/:id
// @access  Private/Admin
const getBlogById = catchAsync(async (req, res) => {
    const blog = await blogService.getBlogById(req.params.id);
    res.status(200).json({ success: true, data: blog });
});

// @desc    Create new blog
// @route   POST /api/admin/blogs
// @access  Private/Admin
const createBlog = catchAsync(async (req, res) => {
    const blog = await blogService.createBlog(req.body, req.file);
    res.status(201).json({ success: true, data: blog });
});

// @desc    Update blog by ID
// @route   PUT /api/admin/blogs/:id
// @access  Private/Admin
const updateBlogById = catchAsync(async (req, res) => {
    const blog = await blogService.updateBlogById(req.params.id, req.body, req.file);
    res.status(200).json({ success: true, data: blog });
});

// @desc    Delete blog by ID
// @route   DELETE /api/admin/blogs/:id
// @access  Private/Admin
const deleteBlogById = catchAsync(async (req, res) => {
    await blogService.deleteBlogById(req.params.id);
    res.status(200).json({ success: true, data: {} });
});

module.exports = {
    getBlogs,
    getBlog,
    getBlogById,
    createBlog,
    updateBlogById,
    deleteBlogById
};
