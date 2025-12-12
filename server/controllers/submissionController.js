// server/controllers/submissionController.js (Updated for Dashboard Fetch)
const { db } = require('../db'); 
const { analyzeImage } = require('../utils/vision');
const { uploadToCloudinary } = require('../utils/cloudinary');
const exifr = require('exifr');
const fs = require('fs/promises'); 

// -----------------------------------------------------
// CREATE SUBMISSION: POST /api/submissions/upload (Non-Contextual, Stable)
// -----------------------------------------------------
exports.createSubmission = async (req, res) => {
    // We are temporarily ignoring task_id for stability
    if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded." });
    }

    const filePath = req.file.path;
    let client;
    let lat, lng;
    let taskContext = "General urban blight reporting."; // Default context for general scoring

    try {
        client = await db.connect(); 
        
        // 1. Extract Geo Data (TEMPORARY FIX FOR TESTING)
        const exifData = await exifr.parse(filePath, ['latitude', 'longitude']);
        lat = exifData?.latitude;
        lng = exifData?.longitude;

        if (!lat || !lng) {
            console.warn("⚠️ FAKING GPS DATA: Using a default location.");
            lat = 12.9716; 
            lng = 77.5946;
        }

        // 2. AI VERIFICATION LAYER (General Check)
        // This is the line that caused the error, but with the simplified logic, it should pass.
        const aiAnalysis = await analyzeImage(filePath, taskContext); 
        const aiScore = aiAnalysis.score; 
        
        let initialStatus = 'pending';
        if (aiScore < 0.6) { 
            initialStatus = 'rejected';
        }

        // 3. Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(filePath);
        const imageUrl = cloudinaryResult.secure_url;
        const publicId = cloudinaryResult.public_id;

        // 4. Save to Database (Omitting task_id column to prevent INSERT errors)
        const query = `
            INSERT INTO submissions 
            (image_url, image_public_id, lat, lng, ai_score, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`;
        
        const values = [imageUrl, publicId, lat, lng, aiScore, initialStatus];
        const result = await client.query(query, values);

        res.status(201).json({ 
            message: "Submission successful. Status: " + initialStatus, 
            submission: result.rows[0] 
        });

    } catch (error) {
        console.error("Submission Error:", error.message);
        res.status(500).json({ error: "Upload Failed" });
    } finally {
        if (filePath) {
            try { await fs.unlink(filePath); } catch (cleanupError) {}
        }
        if (client) {
            client.release();
        }
    }
};

// -----------------------------------------------------
// GET PENDING SUBMISSIONS: GET /api/submissions/pending (NEW FUNCTION)
// -----------------------------------------------------
exports.getPendingSubmissions = async (req, res) => {
    // This function is only executed if the isEditor middleware passes.
    try {
        const result = await db.query(
            "SELECT id, image_url, ai_score, created_at, lat, lng, status FROM submissions WHERE status = 'pending' ORDER BY created_at DESC"
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
    // ... (rest of the updateStatus logic remains the same)
    
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
