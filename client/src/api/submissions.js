// client/src/api/submissions.js

const API_BASE_URL = 'http://localhost:3001/api';

export const getPendingSubmissions = async () => {
    // 1. Retrieve the token saved during the successful login
    const token = localStorage.getItem('editorToken');

    if (!token) {
        throw new Error("Authentication token not found. Please log in.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/submissions/pending`, {
            method: 'GET',
            headers: {
                // CRITICAL: Attach the token to authorize the request
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
        });

        // Check if the response failed (e.g., 401 Unauthorized)
        if (!response.ok) {
             const data = await response.json();
            throw new Error(data.error || 'Failed to fetch submissions.');
        }

        const data = await response.json();
        return data; // Expected: An array of submission objects

    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        throw error;
    }
};