// client/src/api/auth.js

// IMPORTANT: Ensure this matches your running backend URL
const API_BASE_URL = 'http://localhost:3001/api';

// ----------------------------------------------------------------
// 1. EDITOR LOGIN FUNCTION
// Connects to: POST /api/auth/editor-login
// ----------------------------------------------------------------
export const editorLogin = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/editor-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw error with backend message (e.g. "Invalid credentials")
            throw new Error(data.error || 'Editor login failed.');
        }

        // Returns: { message: "...", token: "...", user: { ... } }
        return data;

    } catch (error) {
        console.error("Editor Login API Error:", error);
        throw error;
    }
};

// ----------------------------------------------------------------
// 2. USER LOGIN FUNCTION
// Connects to: POST /api/auth/user-login
// ----------------------------------------------------------------
export const userLogin = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user-login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw error with backend message
            throw new Error(data.error || 'User login failed.');
        }

        // Returns: { message: "...", token: "...", user_id: "..." }
        return data;

    } catch (error) {
        console.error("User Login API Error:", error);
        throw error;
    }
};