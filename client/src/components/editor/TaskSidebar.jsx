// EditorSidebar.jsx
import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import CreateTaskModal from "./CreateTaskModal";
import TaskStatusList from "./TaskStatusList";
import AreaSearch from "./AreaSearch";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

export default function EditorSidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  // load the editor's own tasks (mock now)
  async function loadTasks() {
    try {
      // Replace with real endpoint: GET /api/tasks/my
      const res = await axios.get(`${API_BASE}/tasks/my`);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // fallback mock tasks for UI while backend not ready
      setTasks([
        { id: "t1", title: "Road accident - 12th St", status: "active", created_at: new Date().toISOString() },
        { id: "t2", title: "Water logging - Market", status: "pending", created_at: new Date().toISOString() },
      ]);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="mb-2">
        <h2 className="text-xl font-semibold">Editor Taskbar</h2>
        <p className="text-sm text-gray-500">Create tasks & search by area</p>
      </div>

      <Card>
        <Button onClick={() => setModalOpen(true)} className="w-full">Create Task</Button>
      </Card>

      <Card>
        <h3 className="font-medium mb-2">Search by Area</h3>
        <AreaSearch />
      </Card>

      <Card className="flex-1 overflow-auto">
        <h3 className="font-medium mb-2">My Tasks</h3>
        <TaskStatusList tasks={tasks} onRefresh={loadTasks} />
      </Card>

      <CreateTaskModal open={modalOpen} onClose={() => { setModalOpen(false); loadTasks(); }} />
    </div>
  );
}
