// import React, { useState, useEffect } from "react"; // <-- IMPORTED useEffect
// import PageContainer from "../components/ui/PageContainer";
// import TaskSidebar from "../components/editor/TaskSidebar";
// // --- NEW IMPORT ---
// import { getPendingSubmissions } from '../api/submissions'; 
// // Note: Manaswini must ensure this path is correct and the file exists!
// // ------------------

// export default function EditorDashboard() {
//     // State to hold the data, loading status, and any errors
//     const [submissions, setSubmissions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Keeping existing state

//     // --- DATA FETCHING LOGIC ---
//     useEffect(() => {
//         const fetchSubmissions = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 // Call the API helper that uses the stored JWT token
//                 const data = await getPendingSubmissions(); 
                
//                 // Assuming the backend returns an array of submissions directly
//                 setSubmissions(data); 

//             } catch (err) {
//                 // If the token is invalid or the fetch fails, set the error state
//                 setError(err.message);
//                 console.error("Dashboard Load Error:", err);
                
//                 // Optional: If the error is 'Authentication token not found', 
//                 // Manaswini might want to navigate back to the login page here.
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // Execute the fetch function when the component loads
//         fetchSubmissions();
        
//     }, []); // Empty dependency array means this runs only once on mount
//     // --- END DATA FETCHING LOGIC ---


//     // --- CONDITIONAL RENDERING FOR REVIEW PANEL CONTENT ---
//     let panelContent;
    
//     if (loading) {
//         panelContent = <p className="text-blue-500 font-semibold">Loading Submissions...</p>;
//     } else if (error) {
//         panelContent = (
//             <div className="text-red-600 font-bold">
//                 <p>Error loading reports: {error}</p>
//                 <p className="text-sm font-normal mt-2">
//                     (Hint: Ensure the backend server is running and you are logged in correctly.)
//                 </p>
//             </div>
//         );
//     } else if (submissions.length === 0) {
//         panelContent = <p className="text-gray-500">No new submissions pending review. Great job!</p>;
//     } else {
//         // Display the list of submissions fetched from the backend
//         panelContent = (
//             <div>
//                 <h3 className="text-lg font-semibold mb-3">Incoming Reports ({submissions.length})</h3>
//                 <ul className="space-y-3">
//                     {submissions.map((sub) => (
//                         <li 
//                             key={sub.id} 
//                             className="p-3 border border-gray-200 rounded-base hover:bg-gray-50 cursor-pointer"
//                             // FUTURE: Add onClick={() => navigate(`/editor/submission/${sub.id}`)}
//                         >
//                             <p className="font-medium text-gray-800">Submission ID: {sub.id}</p>
//                             <p className="text-sm text-gray-600">AI Score: <span className="font-semibold">{sub.ai_score}</span> | Status: {sub.status}</p>
//                             {/* Display image thumbnail here later */}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     }
//     // --- END CONDITIONAL RENDERING ---


//     return (
//         <PageContainer>
//             {/* Sidebar + Main Content Layout */}
//             <div className="flex w-full h-full">

//                 {/* LEFT SIDEBAR */}
//                 <TaskSidebar />

//                 {/* RIGHT MAIN CONTENT */}
//                 <div className="flex-1 p-8">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-4">
//                         Editor Dashboard
//                     </h1>

//                     <p className="text-gray-600 mb-6">
//                         This is the workspace where editors manage tasks & view reports.
//                     </p>

//                     {/* Submission Review Panel - Now integrated with data */}
//                     <div className="mt-6 p-6 bg-white shadow-card rounded-base">
//                         <h2 className="text-xl font-semibold mb-4 border-b pb-2">Submission Review Panel</h2>
                        
//                         {panelContent} 

//                     </div>
//                 </div>
//             </div>
//         </PageContainer>
//     );
// }

import React, { useEffect, useState } from "react";
import { getPendingSubmissions } from "../api/submissions"; // Ensure this path is correct

export default function EditorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const data = await getPendingSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending submissions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 1. Dashboard Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Editor Dashboard</h1>
        <p className="text-slate-500 text-lg">
          This is the workspace where editors manage tasks & view reports.
        </p>
      </header>

      {/* 2. Stats / Overview (Optional Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider">Pending</h3>
          <p className="text-3xl font-black text-indigo-600 mt-2">
            {loading ? "..." : submissions.length}
          </p>
        </div>
        {/* Add more stat cards here if needed */}
      </div>

      {/* 3. Submission Review Panel */}
      <section className="bg-white p-8 rounded-[2rem] shadow-soft border border-white/50">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Submission Review Panel</h2>

        {loading && <div className="text-slate-400 animate-pulse">Loading reports...</div>}

        {error && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-red-600">
            <p className="font-bold">Error loading reports:</p>
            <p>{error}</p>
            <p className="text-xs mt-2 opacity-75">(Hint: Ensure the backend server is running and you are logged in correctly.)</p>
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            No pending submissions to review. Good job!
          </div>
        )}

        {/* List of Submissions */}
        <div className="grid gap-4">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Report #{sub.id.substring(0, 8)}</p>
                <p className="text-xs text-slate-500">{new Date(sub.created_at).toLocaleDateString()}</p>
              </div>
              <button className="text-sm font-bold text-indigo-600 hover:underline">
                Review Now →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}