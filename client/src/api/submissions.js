// client/src/api/submissions.js
// COMBINED MASTER VERSION
console.log("submissions api file loaded")
const API_BASE_URL = 'http://localhost:3001/api';

// ----------------------------------------------------------------
// 1. EDITOR: GET PENDING SUBMISSIONS
// ----------------------------------------------------------------
export const getPendingSubmissions = async () => {
    const token = localStorage.getItem('editorToken');
    if (!token) throw new Error("Authentication token not found. Please log in.");

    try {
        // FIXED: Added backticks (`) below
        const response = await fetch(`${API_BASE_URL}/submissions/pending`, {
            method: 'GET',
            headers: {
                // FIXED: Added backticks (`) below
                'Authorization': `Bearer ${token}`, 
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
// 2. USER: UPLOAD SUBMISSION (Image + Audio + Description)
// ----------------------------------------------------------------
// export const uploadSubmission = async (formData) => {
//     const token = localStorage.getItem('userToken');
//     const headers = {};
    
//     // Attach token if user is logged in
//     if (token) {
//         // FIXED: Added backticks (`) below
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     try {
//         // FIXED: Added backticks (`) below
//         const response = await fetch(`${API_BASE_URL}/submissions/upload`, {
//             method: 'POST',
//             headers: headers,
//             body: formData, // Browser automatically sets Content-Type to multipart/form-data
//         });


//         const data = await response.json();
//         if (!response.ok) throw new Error(data.error || 'Upload failed.');
//         return data; 

//     } catch (error) {
//         console.error("Upload API Error:", error);
//         throw error;
//     }
// };
export const uploadSubmission = async (formData) => {
    try {
        console.log("upload functin called");
        const response = await fetch(`${API_BASE_URL}/submissions/submit`, {
            method: 'POST',
            body: formData, // no auth for now
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed.');
        return data;

    } catch (error) {
        console.error("Upload API Error:", error);
        throw error;
    }
};
