// server/routes/tasks.js
const express = require('express');
const router = express.Router();
// Ensure this path is correct:
const { createTask, getTasksByLocation } = require('../controllers/taskController');

// POST /api/tasks - Editor creates a new task
router.post('/', createTask);

// GET /api/tasks - User fetches tasks by location
router.get('/', getTasksByLocation); 

module.exports = router;