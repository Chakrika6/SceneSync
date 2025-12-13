import React, { useEffect, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import UserTaskList from "../components/user/UserTaskList";
import { useNavigate } from "react-router-dom";
export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate(); // Initialize hook
  // ... existing state ...

  // 🟢 NEW HANDLER: General Report
  const handleGeneralReport = () => {
    navigate("/submit", { 
      state: { 
        taskTitle: "General Incident Report",
        taskDescription: "This is a voluntary report not linked to a specific task."
      } 
    });
  };

  // ... rest of your code
  async function loadTasks() {
    try {
      // backend: GET /api/tasks/all or /api/tasks/available
      const res = await fetch("http://localhost:3001/api/tasks/all");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Task load failed, using mock:", err);

      // Mock tasks for UI testing
      setTasks([
        {
          id: "t101",
          title: "Accident on Residency Road",
          description: "Capture traffic situation and any visible damage.",
          location: "Residency Road, Bangalore",
          created_at: "2025-12-12T10:30:00Z",
        },
        {
          id: "t102",
          title: "Flooding in Koramangala 4th Block",
          description: "Show water levels and affected areas.",
          location: "Koramangala 4th Block",
          created_at: "2025-12-12T09:15:00Z",
        },
      ]);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-3">Available Tasks</h1>
        <p className="text-gray-600 mb-6">
          Choose a task and submit your report with photo/video evidence.
        </p>

        <UserTaskList tasks={tasks} />
        {/* 🟢 FLOATING ACTION BUTTON (General Report) */}
<button
  onClick={handleGeneralReport}
  className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 z-50 group"
  title="Report an Incident"
>
  {/* Camera Icon */}
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
  
  {/* Text that slides out on hover (Desktop) or stays hidden (Mobile) */}
  <span className="hidden md:group-hover:block font-bold pr-2">
    Report Incident
  </span>
</button>
      </div>
    </PageContainer>
  );
}
