// server/routes/submissions.js (Updated & Secured)

const express = require('express');
const router = express.Router();
const { db } = require('../db'); 
const upload = require('../middleware/upload'); 

// 1. IMPORT MIDDLEWARE
const { isEditor } = require('../middleware/auth'); 

// 2. IMPORT CONTROLLER FUNCTIONS
const { 
    createSubmission, 
    updateStatus,
    getPendingSubmissions // <--- NEW FUNCTION
} = require('../controllers/submissionController');


// -------------------------------------------------------------------
// 1. UPLOAD PIPELINE (PUBLIC ROUTE)
router.post('/upload', upload.single('image'), createSubmission);


// -------------------------------------------------------------------
// 2. EDITOR DASHBOARD ROUTES (PROTECTED)

// GET /api/submissions/pending 
router.get('/pending', isEditor, getPendingSubmissions); // <--- NOW SECURED

// GET /api/submissions/:id (Detail view)
router.get('/:id', isEditor, async (req, res) => { // <--- NOW SECURED
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM submissions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch submission details" });
    }
});

// PATCH /api/submissions/update-status (Approve/Reject)
router.patch('/update-status', isEditor, updateStatus); // <--- NOW SECURED

// Catch-all
router.get('/', isEditor, async (req, res) => { // <--- NOW SECURED
    return res.redirect('/api/submissions/pending'); 
});


// -------------------------------------------------------------------
module.exports = router;
