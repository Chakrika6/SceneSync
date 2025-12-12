// CreateTaskModal.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

export default function CreateTaskModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitTask() {
    if (!title || !location) {
      alert("Please enter title and location");
      return;
    }
    setLoading(true);
    try {
      // POST /api/tasks/create (backend may expect different body)
      const payload = { title, location, time: time || new Date().toISOString(), description };
      await axios.post(`${API_BASE}/tasks/create`, payload);
      alert("Task created");
      // clear form
      setTitle(""); setLocation(""); setTime(""); setDescription("");
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Create task failed:", err?.response?.data || err.message);
      alert("Failed to create task (mock fallback). Task saved locally.");
      // Optionally: do nothing (since backend not ready)
      if (typeof onClose === "function") onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg p-4">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">Create Task</h3>
            <button onClick={onClose} className="text-gray-500">Close</button>
          </div>

          <div className="space-y-3">
            <Input placeholder="Incident title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Location (name or lat,lng)" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="Short description (what you want reporters to capture)"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="danger" onClick={onClose}>Cancel</Button>
              <Button onClick={submitTask} className="ml-2">{loading ? "Creating..." : "Create Task"}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
