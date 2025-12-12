// ApproveRejectPanel.jsx
// Purpose: Approve or reject a submission. Calls backend PATCH /api/submissions/update-status
import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const api = axios.create({ baseURL: API_BASE });

export default function ApproveRejectPanel({ submissionId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function updateStatus(status) {
    if (!submissionId) return;
    setLoading(true);
    try {
    
      const res = await api.patch("/submissions/update-status", {
        submission_id: submissionId,
        status,
        note: note || undefined,
      });
      alert("Submission updated: " + (res.data?.final_status || status));
      if (typeof onSuccess === "function") onSuccess();
      

    } catch (err) {
      console.error("Update failed:", err?.response?.data || err.message);
      alert(err?.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", marginBottom: 4 }}>Optional note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} style={{ width: "100%", padding: 8 }} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => updateStatus("approved")} disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Updating..." : "Approve"}
        </button>

        <button onClick={() => updateStatus("rejected")} disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Updating..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
