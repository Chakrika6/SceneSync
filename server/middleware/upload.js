// server/middleware/upload.js
const multer = require('multer');

// Store file in memory (RAM)
const storage = multer.memoryStorage();

// FINAL SECURE CONFIG: Re-adds size limit and image-type filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow image types
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

module.exports = upload;
