// TaskStatusList.jsx
import React from "react";
import Button from "../ui/Button";

export default function TaskStatusList({ tasks = [], onRefresh = () => {} }) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 && <p className="text-sm text-gray-500">No tasks created yet.</p>}
      {tasks.map((t) => (
        <div key={t.id} className="p-3 border rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-xs text-gray-500">{t.created_at ? new Date(t.created_at).toLocaleString() : ""}</div>
            </div>
            <div className="text-sm">
              <span className={`px-2 py-1 rounded text-white text-xs ${t.status === 'active' ? 'bg-green-600' : t.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
                {t.status}
              </span>
            </div>
          </div>
          {t.description && <div className="mt-2 text-sm text-gray-700">{t.description}</div>}
          <div className="mt-3 flex gap-2">
            <Button variant="primary" onClick={() => alert("Open task detail - implement later")}>Open</Button>
            <Button variant="danger" onClick={() => { if (confirm("Delete task?")) { /* call API later */ onRefresh(); } }}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
