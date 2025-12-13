// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// ➡️ 1. CRITICAL: Import your authentication middleware
// This middleware must be able to verify a JWT token and attach the user's ID to req.user.id
const { verifyToken } = require('../middleware/auth'); 

// ➡️ 2. Import the controller function from the submission controller
const { getUserSubmissions } = require('../controllers/submissionController'); 

// --- Apply Middleware Protection ---
// All routes defined below this line will require a valid JWT token.
router.use(verifyToken); 

// ➡️ 3. DEFINE THE PROTECTED ROUTE
// GET /api/user/submissions
// This route fetches all submissions relevant to the currently logged-in user.
router.get('/submissions', getUserSubmissions); 

// You can add other authenticated user-specific routes here later (e.g., PUT /profile, GET /notifications)

module.exports = router;