const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
    
// Verify connection
cloudinary.api.ping()
    .then(() => console.log('Cloudinary Connected Successfully! ☁️'))
    .catch((error) => console.error('Cloudinary Connection Error:', error.message));

    
// Setup Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'alphabit_skill_uploads', // The folder name in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional: compress/resize images
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

module.exports = {
    cloudinary,
    upload
};
