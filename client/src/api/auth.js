// client/src/api/auth.js

// IMPORTANT: Ensure the URL matches where your backend server is running!
const API_BASE_URL = 'http://localhost:3001/api';

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
            // Throw an error with the backend's message (e.g., "Invalid credentials")
            throw new Error(data.error || 'Login failed due to network or server error.');
        }

        // CRITICAL: Return the token and user info
        return data; // Expected: { token: "...", user: { ... } }

    } catch (error) {
        console.error("Editor Login API Error:", error);
        throw error;
    }
};