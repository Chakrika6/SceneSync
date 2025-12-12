// client/src/api/submissions.js
const API_BASE_URL = 'http://localhost:3001/api';

// ----------------------------------------------------------------
// 1. EDITOR: GET PENDING SUBMISSIONS (Manaswini's Code)
// ----------------------------------------------------------------
export const getPendingSubmissions = async () => {
    const token = localStorage.getItem('editorToken');
    if (!token) throw new Error("Authentication token not found. Please log in.");

    try {
        const response = await fetch(${API_BASE_URL}/submissions/pending, {
            method: 'GET',
            headers: {
                'Authorization': Bearer ${token}, 
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch submissions.');
        return data; 
    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        throw error;
    }
};

// ----------------------------------------------------------------
// 2. USER: UPLOAD SUBMISSION (Sanjna's Fixed Logic)
// ----------------------------------------------------------------
export const uploadSubmission = async (formData) => {
    const token = localStorage.getItem('userToken');
    const headers = {};
    
    // Attach token if user is logged in
    if (token) {
        headers['Authorization'] = Bearer ${token};
    }

    try {
        const response = await fetch(${API_BASE_URL}/submissions/upload, {
            method: 'POST',
            headers: headers,
            body: formData, // Browser automatically sets Content-Type to multipart/form-data
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed.');
        return data; 

    } catch (error) {
        console.error("Upload API Error:", error);
        throw error;
    }
};