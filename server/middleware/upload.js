// server/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Ensure the upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 2. Configure Storage (Save to Disk, NOT Memory)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save to 'uploads/' folder
    },
    filename: function (req, file, cb) {
        // Create a unique filename: timestamp + random number + extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. File Filter (Optional: Only accept images/audio)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and audio are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB
});

module.exports = upload;
