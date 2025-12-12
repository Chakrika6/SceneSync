// server/routes/submissions.js
const express = require('express');
const router = express.Router(); // <--- 1. Router object initialized
const db = require('../db'); 
const upload = require('../middleware/upload'); 

// Import the controller functions
const { createSubmission, updateStatus } = require('../controllers/submissionController');

// -------------------------------------------------------------------
// 1. UPLOAD PIPELINE
// POST /api/submissions/upload (Used by the User Upload interface)
router.post('/upload', upload.single('image'), createSubmission);

// -------------------------------------------------------------------
// 2. EDITOR DASHBOARD ROUTES (Used by Manaswini)

// GET /api/submissions/pending (Required for EditorDashboard.jsx list)
router.get('/pending', async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, image_url, ai_score, created_at, lat, lng, status FROM submissions WHERE status = 'pending' ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch pending submissions" });
    }
});

// GET /api/submissions/:id (Required for SubmissionDetail.jsx)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch ALL columns for the detail view
        const result = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch submission details" });
    }
});

// PATCH /api/submissions/update-status (Required for ApproveRejectPanel.jsx)
router.patch('/update-status', updateStatus);

// Catch-all route to avoid 404s if someone hits the base URL
router.get('/', async (req, res) => {
    // Redirects to the pending list, which is the most common default
    return res.redirect('/api/submissions/pending'); 
});

// -------------------------------------------------------------------
// 3. THE CRITICAL EXPORT LINE
// This exports the router object to your index.js file
module.exports = router; // <--- 2. Router object is exported
