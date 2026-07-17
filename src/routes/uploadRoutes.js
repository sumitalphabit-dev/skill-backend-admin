const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Public (should be Protected in production)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // The file is automatically uploaded to Cloudinary, and req.file contains the URL
        res.status(200).json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path // Cloudinary URL
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
