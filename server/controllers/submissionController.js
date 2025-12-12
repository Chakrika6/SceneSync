// server/controllers/submissionController.js
const { db } = require('../db'); 
const { analyzeImage } = require('../utils/vision');
const { uploadToCloudinary } = require('../utils/cloudinary');
const exifr = require('exifr');
const fs = require('fs/promises'); 

// -----------------------------------------------------
// CREATE SUBMISSION: POST /api/submissions/upload 
// Supports: Image (Required) + Audio (Optional) + Description (Optional)
// -----------------------------------------------------
exports.createSubmission = async (req, res) => {
    // 1. EXTRACT FILES (Expects upload.fields() in route)
    // req.files is an object: { image: [File], audio: [File] }
    const imageFile = req.files?.['image'] ? req.files['image'][0] : null;
    const audioFile = req.files?.['audio'] ? req.files['audio'][0] : null;
    const { description } = req.body; 

    // Validate Image (Strict Requirement)
    if (!imageFile) {
        return res.status(400).json({ error: "No image file uploaded." });
    }

    const filePath = imageFile.path;
    let client;
    let lat, lng;
    let taskContext = "General urban blight reporting."; 

    try {
        client = await db.connect(); 
        
        // 2. EXTRACT GEO DATA
        // We try to get GPS from the image. If missing, we use a fallback for testing.
        const exifData = await exifr.parse(filePath, ['latitude', 'longitude']);
        lat = exifData?.latitude;
        lng = exifData?.longitude;

        if (!lat || !lng) {
            console.warn("⚠️ FAKING GPS DATA: Using a default location.");
            lat = 12.9716; 
            lng = 77.5946;
        }

        // 3. AI VERIFICATION LAYER
        const aiAnalysis = await analyzeImage(filePath, taskContext); 
        const aiScore = aiAnalysis.score; 
        
        // Auto-Reject if score is too low
        let initialStatus = aiScore < 0.6 ? 'rejected' : 'pending';

        // 4. UPLOAD IMAGE TO CLOUDINARY
        // We pass 'image' as the second arg to ensure correct resource_type
        const imgResult = await uploadToCloudinary(filePath, 'image');
        const imageUrl = imgResult.secure_url;
        const imagePublicId = imgResult.public_id;

        // 5. UPLOAD AUDIO TO CLOUDINARY (Optional)
        let audioUrl = null;
        let audioPublicId = null;

        if (audioFile) {
            try {
                console.log("Processing Audio Upload...");
                // Cloudinary treats audio as 'video' resource_type
                const audioResult = await uploadToCloudinary(audioFile.path, 'video'); 
                audioUrl = audioResult.secure_url;
                audioPublicId = audioResult.public_id;
                
                // Clean up local audio file immediately after upload
                await fs.unlink(audioFile.path);
            } catch (audioErr) {
                console.error("Audio upload failed:", audioErr.message);
                // We proceed without audio rather than failing the whole submission
            }
        }

        // 6. SAVE TO DATABASE
        // We insert the new fields: description, audio_url, audio_public_id
        const query = `
            INSERT INTO submissions 
            (image_url, image_public_id, description, audio_url, audio_public_id, lat, lng, ai_score, status) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *`;
        
        const values = [
            imageUrl, 
            imagePublicId, 
            description || "", // Default to empty string if null
            audioUrl, 
            audioPublicId, 
            lat, 
            lng, 
            aiScore, 
            initialStatus
        ];

        const result = await client.query(query, values);

        res.status(201).json({ 
            message: "Submission successful. Status: " + initialStatus, 
            submission: result.rows[0] 
        });

    } catch (error) {
        console.error("Submission Error:", error.message);
        res.status(500).json({ error: "Upload Failed" });
    } finally {
        // CLEANUP: Always delete the local image file
        if (filePath) {
            try { await fs.unlink(filePath); } catch (cleanupError) {}
        }
        // (Audio file was already cleaned up in the try block, but safety check isn't bad)
        if (client) {
            client.release();
        }
    }
};

// -----------------------------------------------------
// GET PENDING SUBMISSIONS: GET /api/submissions/pending
// -----------------------------------------------------
exports.getPendingSubmissions = async (req, res) => {
    try {
        // Updated query to fetch Description and Audio URL
        const result = await db.query(
            `SELECT 
                id, 
                image_url, 
                description, 
                audio_url, 
                ai_score, 
                created_at, 
                lat, 
                lng, 
                status 
            FROM submissions 
            WHERE status = 'pending' 
            ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching pending submissions:", err);
        res.status(500).json({ error: "Failed to fetch pending submissions" });
    }
};

// -----------------------------------------------------
// UPDATE STATUS: PATCH /api/submissions/update-status 
// -----------------------------------------------------
exports.updateStatus = async (req, res) => {
    const { id, status, editorNotes } = req.body;
    
    if (!id || !status) {
        return res.status(400).json({ error: "Submission ID and new status are required." });
    }
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status provided." });
    }

    try {
        const result = await db.query(
            `UPDATE submissions SET status = $1, editor_notes = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *`,
            [status, editorNotes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found." });
        }

        res.json({ message: `Submission ${id} updated to ${status}.`, submission: result.rows[0] });

    } catch (error) {
        console.error("Error updating submission status:", error);
        res.status(500).json({ error: "Failed to update submission status." });
    }
};
