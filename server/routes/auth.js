// server/routes/auth.js
const express = require('express');
const router = express.Router();

// Import the controller functions
const { editorLogin, userSignup, userLogin } = require('../controllers/authController');

// Editor Login Route
router.post('/editor-login', editorLogin);

// User Signup Route
router.post('/user-signup', userSignup);

// User Login Route
router.post('/user-login', userLogin);

module.exports = router;