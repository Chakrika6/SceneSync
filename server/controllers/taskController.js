// server/controllers/taskController.js
const { db } = require('../db'); 

// -------------------------------------------------------------------
// 1. CREATE TASK: POST /api/tasks
// -------------------------------------------------------------------
exports.createTask = async (req, res) => {
    const { title, description, reward_amount, lat, lng, location_name } = req.body; 

    if (!title || !lat || !lng || reward_amount === undefined) {
        return res.status(400).json({ error: "Title, coordinates (lat/lng), and reward amount are required." });
    }

    try {
        const result = await db.query(
            `INSERT INTO tasks (title, description, reward_amount, lat, lng, location_name)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, description, reward_amount, lat, lng, location_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task." });
    }
};

// -------------------------------------------------------------------
// 2. GET TASKS: GET /api/tasks?location=X
// -------------------------------------------------------------------
exports.getTasksByLocation = async (req, res) => {
    const { location } = req.query; 

    let query = "SELECT id, title, description, reward_amount, location_name FROM tasks WHERE status = 'open'";
    let params = [];

    if (location) {
        query += " AND location_name ILIKE $1";
        params.push(`%${location}%`);
    }

    query += " ORDER BY created_at DESC";

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks." });
    }
};