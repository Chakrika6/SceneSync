// server/controllers/submissionController.js
const { db } = require('../db'); 
const { uploadToCloudinary } = require('../utils/cloudinary');
const exifr = require('exifr'); 
const fs = require('fs/promises'); 

exports.createSubmission = async (req, res) => {
    // 1. CHECK FILES
    const imageFile = req.files?.['image'] ? req.files['image'][0] : null;
    const audioFile = req.files?.['audio'] ? req.files['audio'][0] : null;
    const { description } = req.body; 

    if (!imageFile) {
        return res.status(400).json({ error: "No image file uploaded." });
    }

    // USE RELATIVE PATH (Safer on Windows Node.js)
    const filePath = imageFile.path; 
    console.log("📸 Processing File:", filePath);

    let client;
    let lat = 12.9716; 
    let lng = 77.5946;

    try {
        client = await db.connect(); 

        // --- 2. GPS EXTRACTION ---
        // We do this inside a try/catch block that is totally separate from the upload
        try {
            // Read buffer instead of path to avoid locking the file on disk
            const fileBuffer = await fs.readFile(filePath);
            const exifData = await exifr.parse(fileBuffer, ['latitude', 'longitude']);
            
            if (exifData?.latitude && exifData?.longitude) {
                lat = exifData.latitude;
                lng = exifData.longitude;
            }
        } catch (gpsError) {
            console.warn("⚠️ GPS Skipped:", gpsError.message);
        }

        // --- 3. AI ANALYSIS (Skipped for Stability) ---
        const aiScore = 0.95; 
        const initialStatus = 'pending'; 

        // --- 4. UPLOAD IMAGE TO CLOUDINARY ---
        console.log("☁️ Uploading to Cloudinary...");
        
        // Pass 'image' explicitly so Cloudinary knows what to expect
        const imgResult = await uploadToCloudinary(filePath, 'image');
        const imageUrl = imgResult.secure_url;
        const imagePublicId = imgResult.public_id;

        // --- 5. UPLOAD AUDIO (Optional) ---
        let audioUrl = null;
        let audioPublicId = null;

        if (audioFile) {
            try {
                console.log("🎤 Uploading Audio...");
                const audioResult = await uploadToCloudinary(audioFile.path, 'video'); 
                audioUrl = audioResult.secure_url;
                audioPublicId = audioResult.public_id;
                await fs.unlink(audioFile.path); 
            } catch (audioErr) {
                console.error("Audio error:", audioErr.message);
            }
        }

        // --- 6. SAVE TO DATABASE ---
        const query = `
            INSERT INTO submissions 
            (image_url, image_public_id, description, audio_url, audio_public_id, lat, lng, ai_score, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`;
        
        const values = [
            imageUrl, imagePublicId, description || "", audioUrl, audioPublicId, lat, lng, aiScore, initialStatus
        ];

        const result = await client.query(query, values);

        console.log("✅ Saved to DB!");
        res.status(201).json({ 
            message: "Submission successful.", 
            submission: result.rows[0] 
        });

    } catch (error) {
        console.error("❌ Critical Error:", error.message);
        res.status(500).json({ error: "Upload Failed: " + error.message });
    } finally {
        // ALWAYS CLEANUP
        if (filePath) {
            try { await fs.unlink(filePath); } catch (e) {}
        }
        if (client) client.release();
    }
};

// ... Keep existing getPendingSubmissions and updateStatus below ...
exports.getPendingSubmissions = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, image_url, description, audio_url, ai_score, created_at, lat, lng, status 
            FROM submissions WHERE status = 'pending' ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching pending submissions:", err);
        res.status(500).json({ error: "Failed to fetch pending submissions" });
    }
};

exports.updateStatus = async (req, res) => {
    const { id, status, editorNotes } = req.body;
    if (!id || !status) return res.status(400).json({ error: "Missing ID or status" });

    try {
        const result = await db.query(
            `UPDATE submissions SET status = $1, editor_notes = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *`,
            [status, editorNotes, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Updated", submission: result.rows[0] });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: "Update failed" });
    }
};