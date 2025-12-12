// server/controllers/submissionController.js
const db = require('../db');
const { analyzeImage } = require('../utils/vision');
const { uploadToCloudinary } = require('../utils/cloudinary');
const exifr = require('exifr');

// -----------------------------------------------------
// 1. POST /api/submissions/upload (The Pipeline)
// -----------------------------------------------------
exports.createSubmission = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const fileBuffer = req.file.buffer;

        // GPS Extraction
        let lat = null, lng = null;
        try {
            const gpsData = await exifr.gps(fileBuffer);
            if (gpsData) {
                lat = gpsData.latitude;
                lng = gpsData.longitude;
            }
        } catch (e) { /* silent fail on GPS extraction */ }

        // AI Verification (Currently Mocked)
        const { aiScore } = await analyzeImage(fileBuffer);

        // Cloudinary Upload
        const cloudinaryUrl = await uploadToCloudinary(fileBuffer);

        // Save to Supabase
        const newSubmission = await db.query(
            `INSERT INTO submissions (image_url, ai_score, lat, lng, status) 
             VALUES ($1, $2, $3, $4, 'pending') 
             RETURNING *`,
            [cloudinaryUrl, aiScore, lat, lng]
        );
        const savedData = newSubmission.rows[0];

        // Notify Frontend
        if (req.io) {
            req.io.emit('new_submission', savedData);
        }

        res.status(201).json(savedData);

    } catch (error) {
        console.error("❌ Submission Error:", error);
        res.status(500).json({ error: "Upload Failed" });
    }
};

// -----------------------------------------------------
// 2. PATCH /api/submissions/update-status (For Editors)
// -----------------------------------------------------
exports.updateStatus = async (req, res) => {
    const { submission_id, status, note } = req.body;
    
    // Simple validation
    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status provided." });
    }

    try {
        const result = await db.query(
            "UPDATE submissions SET status = $1, editor_note = $2, reviewed_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
            [status, note, submission_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ error: "Could not update submission status." });
    }
};
// NOTE: We do not need a module.exports block here if we are exporting directly (which we are).
