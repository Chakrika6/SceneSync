import React, { useEffect, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import UserTaskList from "../components/user/UserTaskList";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);

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
      </div>
    </PageContainer>
  );
}
