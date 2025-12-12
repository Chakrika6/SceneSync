import React, { useState, useEffect } from "react"; // <-- IMPORTED useEffect
import PageContainer from "../components/ui/PageContainer";
import TaskSidebar from "../components/editor/TaskSidebar";
// --- NEW IMPORT ---
import { getPendingSubmissions } from '../api/submissions'; 
// Note: Manaswini must ensure this path is correct and the file exists!
// ------------------

export default function EditorDashboard() {
    // State to hold the data, loading status, and any errors
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Keeping existing state

    // --- DATA FETCHING LOGIC ---
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoading(true);
                setError(null);
                // Call the API helper that uses the stored JWT token
                const data = await getPendingSubmissions(); 
                
                // Assuming the backend returns an array of submissions directly
                setSubmissions(data); 

            } catch (err) {
                // If the token is invalid or the fetch fails, set the error state
                setError(err.message);
                console.error("Dashboard Load Error:", err);
                
                // Optional: If the error is 'Authentication token not found', 
                // Manaswini might want to navigate back to the login page here.
            } finally {
                setLoading(false);
            }
        };

        // Execute the fetch function when the component loads
        fetchSubmissions();
        
    }, []); // Empty dependency array means this runs only once on mount
    // --- END DATA FETCHING LOGIC ---


    // --- CONDITIONAL RENDERING FOR REVIEW PANEL CONTENT ---
    let panelContent;
    
    if (loading) {
        panelContent = <p className="text-blue-500 font-semibold">Loading Submissions...</p>;
    } else if (error) {
        panelContent = (
            <div className="text-red-600 font-bold">
                <p>Error loading reports: {error}</p>
                <p className="text-sm font-normal mt-2">
                    (Hint: Ensure the backend server is running and you are logged in correctly.)
                </p>
            </div>
        );
    } else if (submissions.length === 0) {
        panelContent = <p className="text-gray-500">No new submissions pending review. Great job!</p>;
    } else {
        // Display the list of submissions fetched from the backend
        panelContent = (
            <div>
                <h3 className="text-lg font-semibold mb-3">Incoming Reports ({submissions.length})</h3>
                <ul className="space-y-3">
                    {submissions.map((sub) => (
                        <li 
                            key={sub.id} 
                            className="p-3 border border-gray-200 rounded-base hover:bg-gray-50 cursor-pointer"
                            // FUTURE: Add onClick={() => navigate(`/editor/submission/${sub.id}`)}
                        >
                            <p className="font-medium text-gray-800">Submission ID: {sub.id}</p>
                            <p className="text-sm text-gray-600">AI Score: <span className="font-semibold">{sub.ai_score}</span> | Status: {sub.status}</p>
                            {/* Display image thumbnail here later */}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    // --- END CONDITIONAL RENDERING ---


    return (
        <PageContainer>
            {/* Sidebar + Main Content Layout */}
            <div className="flex w-full h-full">

                {/* LEFT SIDEBAR */}
                <TaskSidebar />

                {/* RIGHT MAIN CONTENT */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Editor Dashboard
                    </h1>

                    <p className="text-gray-600 mb-6">
                        This is the workspace where editors manage tasks & view reports.
                    </p>

                    {/* Submission Review Panel - Now integrated with data */}
                    <div className="mt-6 p-6 bg-white shadow-card rounded-base">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Submission Review Panel</h2>
                        
                        {panelContent} 

                    </div>
                </div>
            </div>
        </PageContainer>
    );
}