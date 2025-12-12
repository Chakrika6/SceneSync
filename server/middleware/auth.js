// server/middleware/auth.js

const jwt = require('jsonwebtoken');

// NOTE: Use the same JWT_SECRET key defined in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key'; 

exports.isEditor = (req, res, next) => {
    // 1. Check for 'Authorization: Bearer <token>' header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify and decode the token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. CRITICAL: Check the user role
        if (decoded.role !== 'editor') {
            return res.status(403).json({ error: 'Access denied: Must be an editor' });
        }

        // Attach user info and proceed
        req.user = decoded; 
        next(); 

    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};