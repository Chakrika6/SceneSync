// server/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// resourceType defaults to 'auto' so it detects images/video/audio automatically
const uploadToCloudinary = async (filePath, resourceType = 'auto') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: 'scenesync_submissions', // Organized in a folder
            use_filename: true
        });
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error Details:", error);
        throw new Error(error.message);
    }
};

module.exports = { uploadToCloudinary };