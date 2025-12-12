// server/middleware/auth.js

// 1. Import the supabase client you already configured in db.js
const { supabase } = require('../db'); 

exports.isEditor = async (req, res, next) => {
    try {
        // 1. Check if the Authorization header is present
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // 2. Extract the token
        const token = authHeader.split(' ')[1];

        // 3. ASK SUPABASE: "Is this user valid?"
        // We pass the token to Supabase to verify it for us.
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.error("Token Verification Failed:", error?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // 4. CHECK ROLE: Check if this user is actually an editor
        // We query the 'profiles' table we created earlier.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile || profile.role !== 'editor') {
            return res.status(403).json({ error: 'Access denied: Must be an editor' });
        }

        // 5. Success! Attach user info to request and proceed.
        req.user = user; 
        next(); 

    } catch (err) {
        console.error("Middleware Error:", err);
        return res.status(500).json({ error: 'Internal Server Authentication Error' });
    }
};