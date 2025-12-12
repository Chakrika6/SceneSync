// EditorDashboard.jsx
// Purpose: Loads pending submissions from backend and shows them in a list.
// Backend endpoint expected: GET /api/submissions/pending
import React, { useEffect, useState } from "react";
import axios from "axios";
import SubmissionList from "./SubmissionList";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const api = axios.create({ baseURL: API_BASE });

export default function EditorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPending() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/submissions/pending");
      // Expect res.data to be an array of submissions
      setSubmissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load pending submissions:", err?.response?.data || err.message);
      setError("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSubmissions([
    {
      id: "mock123",
      user_id: "user1",
      ai_relevance_score: 88,
      storage_path: "https://via.placeholder.com/600",
      created_at: new Date().toISOString()
    }
  ]);

    loadPending();
    // Optional: you can later add a polling interval or realtime subscription here
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Editor Dashboard</h2>
      <p>Pending submissions are listed below. Click Review to see details.</p>

      <div style={{ margin: "12px 0" }}>
        <button onClick={loadPending} disabled={loading} style={{ padding: "6px 12px" }}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading submissions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && submissions.length === 0 && <p>No pending submissions.</p>}

      <SubmissionList submissions={submissions} />
    </div>
  );
}
