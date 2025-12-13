// server/routes/submissions.js (Updated for Image + Audio)

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
    getPendingSubmissions 
} = require('../controllers/submissionController');


// -------------------------------------------------------------------
// 1. UPLOAD PIPELINE (PUBLIC ROUTE)
// Updated to accept both 'image' and 'audio' files
router.post('/upload', upload.fields([
    { name: 'image', maxCount: 1 }, // Required by controller
    { name: 'audio', maxCount: 1 }  // Optional
]), createSubmission);


// -------------------------------------------------------------------
// 2. EDITOR DASHBOARD ROUTES (PROTECTED)

// GET /api/submissions/pending 
router.get('/pending', isEditor, getPendingSubmissions); 

// GET /api/submissions/:id (Detail view)
router.get('/:id', isEditor, async (req, res) => { 
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
router.patch('/update-status', isEditor, updateStatus); 

// Catch-all
router.get('/', isEditor, async (req, res) => { 
    return res.redirect('/api/submissions/pending'); 
});


// -------------------------------------------------------------------
module.exports = router;

// // client/src/api/submissions.js

// // 1. Ensure this port matches your backend console (usually 3001 or 5000)
// const API_BASE_URL = 'http://localhost:3001/api'; 

// // ----------------------------------------------------------------
// // 1. GET PENDING SUBMISSIONS (For Editor)
// // ----------------------------------------------------------------
// import express from 'express'; // Ensure express is imported

// const router = express.Router(); // <--- YOU ARE MISSING THIS LINE

// // ... your routes (router.post, router.get, etc.) ...

//  // Now this will work
// export const getPendingSubmissions = async () => {
//     const token = localStorage.getItem('editorToken');
//     // If you want to force login for editors, uncomment the line below:
//     // if (!token) throw new Error("Authentication token not found.");

//     try {
//         const response = await fetch(`${API_BASE_URL}/submissions/pending`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`, 
//                 'Content-Type': 'application/json',
//             },
//         });

//         // SAFETY CHECK: Ensure we got JSON back, not an HTML error page
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             throw new Error("Backend returned HTML (404/500) instead of JSON.");
//         }

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Failed to fetch.');
//         return data; 
//     } catch (error) {
//         console.warn("⚠️ Backend unreachable. Returning MOCK data for testing.");
//         return []; // Return empty array so the page doesn't crash
//     }
// };

// // ----------------------------------------------------------------
// // 2. UPLOAD SUBMISSION (For User)
// // ----------------------------------------------------------------
// export const uploadSubmission = async (formData) => {
//     const token = localStorage.getItem('userToken');
//     const headers = {};
//     if (token) headers['Authorization'] = `Bearer ${token}`;

//     try {
//         // ✅ CORRECTED URL: Matches your "router.post('/upload', ...)"
//         const response = await fetch(`${API_BASE_URL}/submissions/upload`, {
//             method: 'POST',
//             headers: headers,
//             body: formData, // Browser automatically sets Content-Type for FormData
//         });

//         // 🚨 CRITICAL CHECK: Did the server send back HTML (error) or JSON (success)?
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             const text = await response.text();
//             console.error("Server HTML Response:", text); // See the error in Console
//             throw new Error(`Server returned 404 Not Found. URL used: ${API_BASE_URL}/submissions/upload`);
//         }

//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Upload failed.');
//         return data; 

//     } catch (error) {
//         console.error("Upload API Error:", error);
//         throw error; // Re-throw so the SubmitPage knows it failed
//     }
// };
// // DELETE THIS (CommonJS):
// // module.exports = router;

// // ADD THIS (ES Module):
// export default router;