// server/controllers/authController.js
const { supabase, db } = require('../db');

// -----------------------------------------------------
// 1. EDITOR LOGIN: POST /api/auth/editor-login
// -----------------------------------------------------
exports.editorLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // 1. SIGN IN with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Supabase Login Error:", error.message);
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = data.user;

        // 2. CHECK THE USER ROLE (The crucial editor check)
        // Fetches the role from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
            .from('profiles') 
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profile || profile.role !== 'editor') {
            // Log out the user immediately if they are not an editor
            await supabase.auth.signOut(); 
            return res.status(403).json({ error: "Access denied. Not an editor." });
        }

        // 3. SUCCESS RESPONSE
        res.status(200).json({ 
            message: "Editor Login successful.",
            token: data.session.access_token, 
            user: { id: user.id, email: user.email, role: profile.role }
        });

    } catch (error) {
        console.error("Server Error during editor login:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// -----------------------------------------------------
// 2. USER SIGNUP: POST /api/auth/user-signup
// -----------------------------------------------------
exports.userSignup = async (req, res) => {
    const { email, password, name, location } = req.body; 

    if (!email || !password || !name || !location) {
        return res.status(400).json({ error: "Name, email, password, and reporting location are all required." });
    }

    try {
        // 1. Create User in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: name, location: location } } 
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const user = data.user;
        
        // 2. Create Profile in 'profiles' table (default role 'user')
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ 
                id: user.id, 
                email: user.email, 
                role: 'user', 
                full_name: name,
                reporting_location: location // <-- CRITICAL for notifications
            }]);

        if (profileError) {
            console.error("Profile creation failed:", profileError);
            return res.status(500).json({ error: "Signup failed due to profile setup." });
        }

        // 3. SUCCESS RESPONSE
        res.status(201).json({ 
            message: "User created successfully. Please log in.",
            user: { id: user.id, email: user.email, role: 'user', location: location }
        });

    } catch (error) {
        console.error("Server Error during user signup:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

// -----------------------------------------------------
// 3. USER LOGIN: POST /api/auth/user-login (ROLE CHECK ADDED)
// -----------------------------------------------------
exports.userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        // 1. SIGN IN WITH SUPABASE AUTH (Credential Check)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = data.user;

        // 2. CHECK THE USER ROLE (The crucial user check)
        // Fetches the role from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
            .from('profiles') 
            .select('role')
            .eq('id', user.id)
            .single();

        // Check if the profile fetch failed OR if the role is NOT 'user'
        if (profileError || !profile || profile.role !== 'user') {
            // Log out the user immediately since they are trying to log into the wrong endpoint
            await supabase.auth.signOut(); 
            
            // Return 403 Forbidden to indicate they are a valid user type, but not for *this* endpoint
            return res.status(403).json({ error: "Access denied. Only standard users may use this login." });
        }


        // 3. SUCCESS RESPONSE (Returns token for session)
        res.status(200).json({ 
            message: "Login successful.",
            token: data.session.access_token,
            user_id: data.user.id
        });

    } catch (error) {
        console.error("Server Error during user login:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};